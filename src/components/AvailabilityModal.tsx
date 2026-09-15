import {useMemo, useState} from 'react';
import {Modal, View, Text, ScrollView, TouchableOpacity, TouchableWithoutFeedback} from 'react-native';
import {Calendar} from 'react-native-calendars';
import {useQuery} from '@tanstack/react-query';
import dayjs from 'dayjs';
import {colors} from '../styles/colors';
import {styles} from '../styles/availability-modal';
import {useAuthHeader} from '../hooks/useAuthHeader';

interface AvailabilityInterval {
    start: string;
    end: string | null;
    userId: number;
}

interface AvailabilityMap {
    [date: string]: AvailabilityInterval[];
}

interface TimedSegment {
    start: number;
    end: number;
    count: number;
}

interface OpenEndedSegment {
    start: number;
    count: number;
}

interface AvailabilityModalProps {
    visible: boolean;
    onClose: () => void;
    groupId: number | null;
    initialDate?: Date | null;
}

const getSegmentsForDay = (intervals: AvailabilityInterval[]): { timedSegments: TimedSegment[]; openEndedSegments: OpenEndedSegment[] } => {
    const timed = intervals.filter((i) => i.end !== null);
    const openEnded = intervals.filter((i) => i.end === null);

    const timePoints = new Set<number>();
    timed.forEach((i) => {
        timePoints.add(dayjs(i.start).valueOf());
        timePoints.add(dayjs(i.end as string).valueOf());
    });
    const sortedPoints = Array.from(timePoints).sort((a, b) => a - b);

    const rawSegments: { start: number; end: number; userIds: Set<number> }[] = [];
    for (let i = 0; i < sortedPoints.length - 1; i++) {
        const segStart = sortedPoints[i];
        const segEnd = sortedPoints[i + 1];
        if (segStart === segEnd) continue;

        const activeUserIds = new Set<number>();
        timed.forEach((interval) => {
            const s = dayjs(interval.start).valueOf();
            const e = dayjs(interval.end as string).valueOf();
            if (s <= segStart && e >= segEnd) {
                activeUserIds.add(interval.userId);
            }
        });

        if (activeUserIds.size > 0) {
            rawSegments.push({start: segStart, end: segEnd, userIds: activeUserIds});
        }
    }

    const timedSegments: TimedSegment[] = [];
    rawSegments.forEach((seg) => {
        const count = seg.userIds.size;
        const last = timedSegments[timedSegments.length - 1];
        if (last && last.end === seg.start && last.count === count) {
            last.end = seg.end;
        } else {
            timedSegments.push({start: seg.start, end: seg.end, count});
        }
    });

    const openEndedGroups = new Map<number, Set<number>>();
    openEnded.forEach((interval) => {
        const s = dayjs(interval.start).valueOf();
        if (!openEndedGroups.has(s)) openEndedGroups.set(s, new Set());
        openEndedGroups.get(s)!.add(interval.userId);
    });
    const openEndedSegments: OpenEndedSegment[] = Array.from(openEndedGroups.entries())
        .map(([start, userIds]) => ({start, count: userIds.size}))
        .sort((a, b) => a.start - b.start);

    return {timedSegments, openEndedSegments};
};

export const AvailabilityModal = ({visible, onClose, groupId, initialDate}: AvailabilityModalProps) => {
    const authHeader = useAuthHeader();
    const seedDate = initialDate ?? new Date();

    const [availabilityYear, setAvailabilityYear] = useState(seedDate.getFullYear());
    const [availabilityMonth, setAvailabilityMonth] = useState(seedDate.getMonth() + 1);
    const [visibleMonth, setVisibleMonth] = useState(dayjs(seedDate).format('YYYY-MM-DD'));
    const [selectedDetailDate, setSelectedDetailDate] = useState<string | null>(null);

    const {data: availability = {}, error} = useQuery<AvailabilityMap>({
        queryKey: ['availability', groupId, availabilityYear, availabilityMonth],
        enabled: visible && !!groupId && !!authHeader.Authorization,
        queryFn: async () => {
            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/event/availability?id=${groupId}&year=${availabilityYear}&month=${availabilityMonth}`, {
                method: 'GET',
                headers: authHeader
            });
            const data = await response.json();
            if (data.success) {
                return data.response;
            }
            throw new Error(data.error);
        }
    });

    const markedDates = useMemo(() => {
        const marked: Record<string, any> = {};
        Object.entries(availability).forEach(([date, intervals]) => {
            if (intervals.length === 0) return;
            const hasDefinedEnd = intervals.some((interval) => interval.end !== null);
            const dotColor = hasDefinedEnd ? colors.terracotta.primary : colors.terracotta.secondary;
            marked[date] = {marked: true, dotColor};
        });
        if (selectedDetailDate) {
            marked[selectedDetailDate] = {
                ...(marked[selectedDetailDate] || {}),
                selected: true,
                selectedColor: colors.terracotta.primary,
            };
        }
        return marked;
    }, [availability, selectedDetailDate]);

    const onMonthChange = (month: { year: number; month: number }) => {
        setAvailabilityYear(month.year);
        setAvailabilityMonth(month.month);
        setSelectedDetailDate(null);
    };

    const detail = selectedDetailDate ? getSegmentsForDay(availability[selectedDetailDate] ?? []) : null;

    const handleClose = () => {
        setSelectedDetailDate(null);
        onClose();
    };

    return (
        <Modal visible={visible} transparent animationType="fade">
            <TouchableWithoutFeedback onPress={handleClose}>
                <View style={styles.overlay}>
                    <TouchableWithoutFeedback onPress={() => {}}>
                        <View style={styles.content}>
                            <Text style={styles.title}>Group Availability</Text>
                            <Calendar
                                current={visibleMonth}
                                onDayPress={(day) => setSelectedDetailDate(day.dateString)}
                                onMonthChange={onMonthChange}
                                markedDates={markedDates}
                                markingType="dot"
                                theme={{
                                    todayTextColor: colors.terracotta.primary,
                                    selectedDayBackgroundColor: colors.terracotta.primary,
                                    arrowColor: colors.terracotta.primary,
                                }}
                            />
                            {selectedDetailDate && (
                                <View style={styles.detailPanel}>
                                    <Text style={styles.detailTitle}>
                                        {dayjs(selectedDetailDate).format('dddd, MMM D')}
                                    </Text>
                                    {detail && detail.timedSegments.length === 0 && detail.openEndedSegments.length === 0 ? (
                                        <Text style={styles.detailEmpty}>No group members are busy this day</Text>
                                    ) : (
                                        <ScrollView style={styles.detailScroll}>
                                            {detail?.timedSegments.map((seg, idx) => (
                                                <Text key={`t-${idx}`} style={styles.detailRow}>
                                                    {seg.count} {seg.count === 1 ? 'person' : 'people'} busy {dayjs(seg.start).format('h:mm A')}–{dayjs(seg.end).format('h:mm A')}
                                                </Text>
                                            ))}
                                            {detail?.openEndedSegments.map((seg, idx) => (
                                                <Text key={`o-${idx}`} style={styles.detailRow}>
                                                    {seg.count} {seg.count === 1 ? 'person' : 'people'} busy from {dayjs(seg.start).format('h:mm A')}, open-ended
                                                </Text>
                                            ))}
                                        </ScrollView>
                                    )}
                                </View>
                            )}
                            <TouchableOpacity onPress={handleClose}>
                                <Text style={styles.modalClose}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}
