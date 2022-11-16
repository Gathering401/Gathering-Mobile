import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    horizontalScroller: {
        backgroundColor: 'rgba(219, 140, 213, .2)',
        color: 'orange',
        width: '100%'
    },
    horizontalScrollerWrapper: {
        borderTopColor: 'grey',
        borderTopWidth: '1px',
        borderBottomColor: 'grey',
        borderBottomWidth: '1px'
    },
    card: {
        width: 150,
        height: 150,
        marginBottom: 15,
        padding: 0,
        textAlign: 'center'
    },
    cardTitleWrapper: {
        borderBottomColor: 'grey',
        borderBottomWidth: '1px',
        marginTop: 5,
        marginBottom: 5
    },
    cardTitle: {
        margin: 0,
        padding: 0
    },
    viewTitle: {
        color: 'rgb(150, 150, 150)',
        margin: 10
    },
    containerColor: {
        backgroundColor: '#fff'
    }
});