import {StyleSheet} from 'react-native';
import {colors} from './colors';

export const styles = StyleSheet.create({
    overlay: {flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', paddingHorizontal: 24},
    content: {backgroundColor: '#fff', borderRadius: 16, padding: 24, maxHeight: '80%'},
    title: {fontSize: 18, fontWeight: '700', marginBottom: 12, color: '#1a1a1a'},
    detailPanel: {marginTop: 16, borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 12},
    detailTitle: {fontSize: 15, fontWeight: '600', marginBottom: 8, color: '#1a1a1a'},
    detailScroll: {maxHeight: 140},
    detailRow: {fontSize: 14, color: '#333', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: '#f2f2f2'},
    detailEmpty: {fontSize: 14, color: '#8a8a86'},
    modalClose: {textAlign: 'center', marginTop: 16, fontSize: 15, color: colors.terracotta.primary},
});
