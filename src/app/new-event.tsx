import {useState} from 'react';
import {useRouter, useLocalSearchParams} from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import {useForm, Controller, FieldErrors} from 'react-hook-form';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import DateTimePicker from '@react-native-community/datetimepicker';
import dayjs from 'dayjs';
import {useEffect, useRef} from 'react';
import {
    View, Text, TextInput, TouchableOpacity, ScrollView,
    KeyboardAvoidingView, Platform, Modal, ActivityIndicator,
    TouchableWithoutFeedback, Keyboard
} from 'react-native';
import {GatheringGroup} from '../constants/GatheringGroup';
import {Repetition, getRepetitionOptions, getRepetitionByValue} from '../constants/enums/Repetition';
import {styles} from "../styles/new-event";
import {AddressAutocomplete, AddressAutocompleteHandle} from "../components/AddressAutoComplete";
import {SafeAreaView, useSafeAreaInsets} from "react-native-safe-area-context";
import {useAuthHeader} from "../hooks/useAuthHeader";
import {AvailabilityModal} from "../components/AvailabilityModal";

interface EventValues {
    name: string;
    description: string;
    location: string;
    cost: string;
    date: Date | null;
    endDate: Date | null;
    repetition: Repetition;
    groupId: number | null;
}

const EventForm = () => {
    const router = useRouter();
    const params = useLocalSearchParams();
    const queryClient = useQueryClient();
    const scrollViewRef = useRef<ScrollView>(null);
    const locationRef = useRef<AddressAutocompleteHandle>(null);
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<any>(null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showEndDatePicker, setShowEndDatePicker] = useState(false);
    const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);
    const [showGroupPicker, setShowGroupPicker] = useState(false);
    const [showRepetitionPicker, setShowRepetitionPicker] = useState(false);

    const authHeader = useAuthHeader();
    const insets = useSafeAreaInsets();

    const isEditing = !!params.id;
    const editDateEnabled = params.editDateEnabled === 'true';
    const businessInvitationId = params.businessInvitationId ? Number(params.businessInvitationId) : undefined;

    const locationDisabled = !!businessInvitationId;
    const dateDisabled = isEditing && !editDateEnabled;
    const repetitionDisabled = isEditing;
    const groupDisabled = isEditing || !!params.groupId;

    useEffect(() => {
        SecureStore.getItemAsync('token').then(setToken);
        SecureStore.getItemAsync('user').then(u => u && setUser(JSON.parse(u)));
    }, []);

    const {control, handleSubmit, watch, setValue, formState: {isValid}} = useForm<EventValues>({
        mode: 'onChange',
        defaultValues: {
            name: (params.name as string) ?? '',
            description: (params.description as string) ?? '',
            location: (params.location as string) ?? '',
            cost: (params.cost as string) ?? '0',
            date: params.date ? new Date(params.date as string) : null,
            endDate: params.endDate ? new Date(params.endDate as string) : null,
            repetition: params.repetition ? Number(params.repetition) as Repetition : Repetition.none,
            groupId: params.groupId ? Number(params.groupId) : null
        }
    });

    const selectedDate = watch('date');
    const selectedGroupId = watch('groupId');
    const selectedRepetition = watch('repetition');

    const {isLoading, data: myGroups = []} = useQuery<GatheringGroup[]>({
        queryKey: ['groups', 'creatable'],
        enabled: !!token,
        queryFn: async () => {
            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/group/creatable`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (data.success) {
                return data.response;
            }

            throw new Error(data.error);
        }
    });

    const mapValuesToEventPost = (values: EventValues) => {
        const dates = [];
        let interval: 'year' | 'month' | 'week' | undefined;
        let count: number;

        switch (values.repetition) {
            case Repetition.annually:
                interval = 'year';
                count = 100;
                break;
            case Repetition.monthly:
                interval = 'month';
                count = 60;
                break;
            case Repetition.weekly:
                interval = 'week';
                count = 104;
                break;
            default:
                interval = undefined;
                count = 1;
                break;
        }

        for (let i = 0; i < count; i++) {
            dates.push(dayjs(values.date).add(i, interval).toISOString());
        }

        return {
            name: values.name,
            description: values.description,
            location: values.location,
            dates,
            endDate: values.endDate ? dayjs(values.endDate).toISOString() : null,
            groupId: values.groupId,
            hostId: user?.id,
            cost: Number(values.cost),
            repetition: values.repetition,
            ...(businessInvitationId ? {businessInvitationId} : {})
        }
    }

    const today = new Date();

    const {mutate: submitEvent, isPending} = useMutation({
        mutationFn: async (values: EventValues) => {
            let url: string;
            let method: string;
            let body: object;

            if (isEditing) {
                const queryParams = new URLSearchParams({
                    id: String(values.groupId),
                    eventId: String(params.id),
                });

                if (params.seriesId) {
                    queryParams.set('seriesId', String(params.seriesId));
                }

                url = `${process.env.EXPO_PUBLIC_API_URL}/event?${queryParams.toString()}`;
                method = 'PUT';

                body = {
                    id: Number(params.id),
                    name: values.name,
                    description: values.description,
                    location: values.location,
                    cost: Number(values.cost),
                    date: editDateEnabled ? dayjs(values.date).toISOString() : undefined,
                    endDate: editDateEnabled ? (values.endDate ? dayjs(values.endDate).toISOString() : null) : undefined,
                    repetition: values.repetition,
                    group_id: values.groupId,
                }
            } else {
                url = `${process.env.EXPO_PUBLIC_API_URL}/event?id=${values.groupId}`;
                method = 'POST';
                body = mapValuesToEventPost(values);
            }

            const response = await fetch(url, {
                body: JSON.stringify(body),
                method,
                headers: authHeader
            });

            const data = await response.json();
            if (!data.success) {
                throw new Error(data.error);
            }

            return {
                data,
                groupId: values.groupId
            }
        },
        onSuccess: async ({data, groupId}) => {
            if (isEditing) {
                await queryClient.invalidateQueries({queryKey: [`eventId-${params.id}`]});
                await queryClient.invalidateQueries({queryKey: [`groupId-${groupId}`]});
                await queryClient.invalidateQueries({queryKey: ['events']});
                if (businessInvitationId) {
                    await queryClient.invalidateQueries({queryKey: ['activeInvitations']});
                }
                router.back();
            } else {
                await queryClient.invalidateQueries({queryKey: [`groupId-${groupId}`]});
                await queryClient.invalidateQueries({queryKey: ['events']});
                if (businessInvitationId) {
                    await queryClient.invalidateQueries({queryKey: ['activeInvitations']});
                }
                router.replace({
                    pathname: `/event/${data.response.id}`,
                    params: {groupId: String(groupId)}
                });
            }
        },
        onError: () => {
            Toast.show({type: 'error', text1: 'Error', text2: 'Something went wrong. Please try again.'});
        }
    });

    const onSubmit = (values: EventValues) => {
        submitEvent(values);
    }

    const onInvalid = (errors: FieldErrors<EventValues>) => {
        const order: { field: keyof EventValues; label: string }[] = [
            {field: 'name', label: 'Name'},
            {field: 'description', label: 'Description'},
            {field: 'location', label: 'Location'},
            {field: 'date', label: 'Date'},
            {field: 'endDate', label: 'End Date'},
            {field: 'groupId', label: 'Group'},
        ];

        const firstError = order.find(({field}) => errors[field]);
        if (firstError) {
            Toast.show({
                type: 'error',
                text1: firstError.label,
                text2: errors[firstError.field]?.message as string
            });
        }
    }

    const repetitionOptions = getRepetitionOptions();

    return (
        <SafeAreaView style={{flex: 1}} edges={['top']}>
            <KeyboardAvoidingView style={{flex: 1}} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <TouchableWithoutFeedback onPress={() => {
                    Keyboard.dismiss();
                    locationRef.current?.blur();
                }}>
                    <View style={{flex: 1}}>
                        <ScrollView ref={scrollViewRef} contentContainerStyle={styles.container}>
                            <Text style={styles.title}>{isEditing ? 'Edit Event' : 'New Event'}</Text>
                            <Text style={styles.legend}>* Required</Text>
                            <Controller
                                control={control}
                                name="name"
                                rules={{
                                    validate: (value) => {
                                        if (!value?.trim()) return 'Event name is required';
                                        if (value.length > 50) return 'Event name cannot exceed 50 characters';
                                        return true;
                                    }
                                }}
                                render={({field: {onChange, value}}) => (
                                    <View style={styles.fieldContainer}>
                                        <Text style={styles.label}>Event Name<Text
                                            style={styles.required}> *</Text></Text>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Event Name"
                                            maxLength={50}
                                            autoCapitalize="words"
                                            autoCorrect={false}
                                            value={value}
                                            onChangeText={onChange}
                                        />
                                    </View>
                                )}
                            />
                            <Controller
                                control={control}
                                name="description"
                                rules={{
                                    validate: (value) => {
                                        if (!value?.trim()) return 'Event description is required';
                                        if (value.length > 500) return 'Event description cannot exceed 500 characters';
                                        return true;
                                    }
                                }}
                                render={({field: {onChange, value}}) => (
                                    <View style={styles.fieldContainer}>
                                        <Text style={styles.label}>Description<Text
                                            style={styles.required}> *</Text></Text>
                                        <TextInput
                                            style={[styles.input, styles.textarea]}
                                            placeholder="Description"
                                            maxLength={500}
                                            multiline
                                            numberOfLines={4}
                                            autoCapitalize="sentences"
                                            value={value}
                                            onChangeText={onChange}
                                        />
                                    </View>
                                )}
                            />
                            <Controller
                                control={control}
                                name="groupId"
                                rules={{
                                    validate: (value) => !!value || 'Please select a group'
                                }}
                                render={({field: {onChange, value}}) => {
                                    const selectedGroup = myGroups.find(g => g.id === value);
                                    return (
                                        <View style={styles.fieldContainer}>
                                            <Text style={styles.label}>Group<Text
                                                style={styles.required}> *</Text></Text>
                                            <TouchableOpacity
                                                style={[styles.input, styles.selectButton, groupDisabled && styles.disabled]}
                                                disabled={groupDisabled}
                                                onPress={() => setShowGroupPicker(true)}
                                            >
                                                <Text style={{color: groupDisabled ? '#999' : selectedGroup ? '#333' : '#999'}}>
                                                    {isLoading ? 'Loading...' : selectedGroup?.name ?? 'Select a group'}
                                                </Text>
                                            </TouchableOpacity>
                                            <Modal visible={showGroupPicker} transparent animationType="slide">
                                                <TouchableWithoutFeedback onPress={() => setShowGroupPicker(false)}>
                                                    <View style={styles.modalOverlay}>
                                                        <View style={styles.modalContent}>
                                                            <Text style={styles.modalTitle}>Select Group</Text>
                                                            {myGroups.map((g) => (
                                                                <TouchableOpacity
                                                                    key={g.id}
                                                                    style={styles.modalOption}
                                                                    onPress={() => {
                                                                        onChange(g.id as number);
                                                                        setShowGroupPicker(false);
                                                                    }}
                                                                >
                                                                    <Text style={styles.modalOptionText}>{g.name}</Text>
                                                                </TouchableOpacity>
                                                            ))}
                                                            <TouchableOpacity onPress={() => setShowGroupPicker(false)}>
                                                                <Text style={styles.modalCancel}>Close</Text>
                                                            </TouchableOpacity>
                                                        </View>
                                                    </View>
                                                </TouchableWithoutFeedback>
                                            </Modal>
                                        </View>
                                    );
                                }}
                            />
                            <Controller
                                control={control}
                                name="location"
                                rules={{
                                    validate: (value) => {
                                        if (!value?.trim()) return 'Event location is required';
                                        if (value.length > 100) return 'Event location cannot exceed 100 characters';
                                        return true;
                                    }
                                }}
                                render={({field: {onChange, value}}) => (
                                    <View style={styles.fieldContainer}>
                                        <Text style={styles.label}>Location<Text
                                            style={styles.required}> *</Text></Text>
                                        <AddressAutocomplete
                                            ref={locationRef}
                                            initialValue={value}
                                            disabled={locationDisabled}
                                            onSelect={(lat, lng, address) => onChange(address)}
                                            onClear={() => onChange('')}
                                        />
                                    </View>
                                )}
                            />
                            <Controller
                                control={control}
                                name="date"
                                rules={{
                                    validate: (value) => {
                                        if (!value) return 'Please select a date';
                                        if (dayjs(value).isBefore(dayjs().startOf('day').add(1, 'day'))) {
                                            return 'Event date must be in the future';
                                        }
                                        return true;
                                    }
                                }}
                                render={({field: {onChange, value}}) => (
                                    <View style={styles.fieldContainer}>
                                        <Text style={styles.label}>Date<Text style={styles.required}> *</Text></Text>
                                        <TouchableOpacity
                                            style={[styles.input, styles.selectButton, dateDisabled && styles.disabled]}
                                            disabled={dateDisabled}
                                            onPress={() => setShowDatePicker(true)}
                                        >
                                            <Text style={{color: dateDisabled ? '#999' : value ? '#333' : '#999'}}>
                                                {value ? dayjs(value).format('MMM D, YYYY h:mm A') : 'Select date'}
                                            </Text>
                                        </TouchableOpacity>
                                        {showDatePicker && Platform.OS === 'ios' && (
                                            <Modal visible={showDatePicker} transparent animationType="slide">
                                                <TouchableWithoutFeedback onPress={() => setShowDatePicker(false)}>
                                                    <View style={styles.modalOverlay}>
                                                        <TouchableWithoutFeedback>
                                                            <View style={styles.modalContent}>
                                                                <DateTimePicker
                                                                    value={value ?? today}
                                                                    mode="datetime"
                                                                    display="spinner"
                                                                    minimumDate={today}
                                                                    onChange={(_, date) => {
                                                                        if (date) onChange(date);
                                                                    }}
                                                                />
                                                                <TouchableOpacity
                                                                    style={styles.secondaryButton}
                                                                    onPress={() => setShowDatePicker(false)}
                                                                >
                                                                    <Text style={styles.secondaryButtonText}>Done</Text>
                                                                </TouchableOpacity>
                                                            </View>
                                                        </TouchableWithoutFeedback>
                                                    </View>
                                                </TouchableWithoutFeedback>
                                            </Modal>
                                        )}
                                        {showDatePicker && Platform.OS !== 'ios' && (
                                            <DateTimePicker
                                                value={value ?? today}
                                                mode="datetime"
                                                display="default"
                                                minimumDate={today}
                                                onChange={(_, date) => {
                                                    setShowDatePicker(false);
                                                    if (date) onChange(date);
                                                }}
                                            />
                                        )}
                                        <TouchableOpacity
                                            style={[styles.secondaryButton, !selectedGroupId && styles.disabled]}
                                            disabled={!selectedGroupId}
                                            onPress={() => setShowAvailabilityModal(true)}
                                        >
                                            <Text style={styles.secondaryButtonText}>
                                                {selectedGroupId ? 'Check Group Availability' : 'Select a group to check availability'}
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                )}
                            />
                            <Controller
                                control={control}
                                name="endDate"
                                rules={{
                                    validate: (value, formValues) => {
                                        if (value && dayjs(value).isBefore(dayjs(formValues.date))) {
                                            return 'End date must be after the start date';
                                        }
                                        return true;
                                    }
                                }}
                                render={({field: {onChange, value}}) => (
                                    <View style={styles.fieldContainer}>
                                        <View style={styles.endDateHeader}>
                                            <Text style={styles.label}>End Date</Text>
                                            {value && !dateDisabled && (
                                                <TouchableOpacity onPress={() => onChange(null)}>
                                                    <Text style={styles.clearText}>Remove</Text>
                                                </TouchableOpacity>
                                            )}
                                        </View>
                                        {value ? (
                                            <TouchableOpacity
                                                style={[styles.input, styles.selectButton, dateDisabled && styles.disabled]}
                                                disabled={dateDisabled}
                                                onPress={() => setShowEndDatePicker(true)}
                                            >
                                                <Text style={{color: dateDisabled ? '#999' : '#333'}}>
                                                    {dayjs(value).format('MMM D, YYYY h:mm A')}
                                                </Text>
                                            </TouchableOpacity>
                                        ) : (
                                            <TouchableOpacity
                                                style={[styles.secondaryButton, dateDisabled && styles.disabled]}
                                                disabled={dateDisabled}
                                                onPress={() => {
                                                    onChange(selectedDate ?? today);
                                                    setShowEndDatePicker(true);
                                                }}
                                            >
                                                <Text style={styles.secondaryButtonText}>+ Add end date</Text>
                                            </TouchableOpacity>
                                        )}
                                        {showEndDatePicker && Platform.OS === 'ios' && (
                                            <Modal visible={showEndDatePicker} transparent animationType="slide">
                                                <TouchableWithoutFeedback onPress={() => setShowEndDatePicker(false)}>
                                                    <View style={styles.modalOverlay}>
                                                        <TouchableWithoutFeedback>
                                                            <View style={styles.modalContent}>
                                                                <DateTimePicker
                                                                    value={value ?? selectedDate ?? today}
                                                                    mode="datetime"
                                                                    display="spinner"
                                                                    minimumDate={selectedDate ?? today}
                                                                    onChange={(_, date) => {
                                                                        if (date) onChange(date);
                                                                    }}
                                                                />
                                                                <TouchableOpacity
                                                                    style={styles.secondaryButton}
                                                                    onPress={() => setShowEndDatePicker(false)}
                                                                >
                                                                    <Text style={styles.secondaryButtonText}>Done</Text>
                                                                </TouchableOpacity>
                                                            </View>
                                                        </TouchableWithoutFeedback>
                                                    </View>
                                                </TouchableWithoutFeedback>
                                            </Modal>
                                        )}
                                        {showEndDatePicker && Platform.OS !== 'ios' && (
                                            <DateTimePicker
                                                value={value ?? selectedDate ?? today}
                                                mode="datetime"
                                                display="default"
                                                minimumDate={selectedDate ?? today}
                                                onChange={(_, date) => {
                                                    setShowEndDatePicker(false);
                                                    if (date) onChange(date);
                                                }}
                                            />
                                        )}
                                    </View>
                                )}
                            />
                            <View style={styles.fieldContainer}>
                                <Text style={styles.label}>Repetition</Text>
                                <TouchableOpacity
                                    style={[styles.input, styles.selectButton, repetitionDisabled && styles.disabled]}
                                    disabled={repetitionDisabled}
                                    onPress={() => setShowRepetitionPicker(true)}
                                >
                                    <Text style={{color: repetitionDisabled ? '#999' : '#333'}}>
                                        {repetitionOptions.find(o => getRepetitionByValue(o.value) === selectedRepetition)?.label ?? 'Select repetition'}
                                    </Text>
                                </TouchableOpacity>
                                <Modal visible={showRepetitionPicker} transparent animationType="slide">
                                    <TouchableWithoutFeedback onPress={() => setShowRepetitionPicker(false)}>
                                        <View style={styles.modalOverlay}>
                                            <TouchableWithoutFeedback>
                                                <View style={styles.modalContent}>
                                                    <Text style={styles.modalTitle}>Repetition</Text>
                                                    {repetitionOptions.map((opt: { label: string; value: string }) => (
                                                        <TouchableOpacity
                                                            key={opt.value}
                                                            style={styles.modalOption}
                                                            onPress={() => {
                                                                setValue('repetition', getRepetitionByValue(opt.value) as Repetition);
                                                                setShowRepetitionPicker(false);
                                                            }}
                                                        >
                                                            <Text style={styles.modalOptionText}>{opt.label}</Text>
                                                        </TouchableOpacity>
                                                    ))}
                                                    <TouchableOpacity onPress={() => setShowRepetitionPicker(false)}>
                                                        <Text style={styles.modalCancel}>Close</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            </TouchableWithoutFeedback>
                                        </View>
                                    </TouchableWithoutFeedback>
                                </Modal>
                            </View>
                            <Controller
                                control={control}
                                name="cost"
                                render={({field: {onChange, value}}) => (
                                    <View style={styles.fieldContainer}>
                                        <Text style={styles.label}>Cost ($)</Text>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="0"
                                            keyboardType="decimal-pad"
                                            value={value}
                                            onChangeText={(text) => onChange(text.replace(/^0+(?=\d)/, ''))}
                                        />
                                    </View>
                                )}
                            />
                            <Toast/>
                        </ScrollView>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
            <View style={[styles.footer, {paddingBottom: insets.bottom + 16}]}>
                <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
                    <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.submitButton, (isPending || !isValid) && styles.submitButtonDisabled]}
                    onPress={handleSubmit(onSubmit, onInvalid)}
                    disabled={isPending || !isValid}
                >
                    {isPending
                        ? <ActivityIndicator color="#fff"/>
                        : <Text style={styles.submitText}>{isEditing ? 'Save' : 'Submit'}</Text>
                    }
                </TouchableOpacity>
            </View>
            <AvailabilityModal
                visible={showAvailabilityModal}
                onClose={() => setShowAvailabilityModal(false)}
                groupId={selectedGroupId}
                initialDate={selectedDate}
            />
        </SafeAreaView>
    );
}

export default EventForm;
