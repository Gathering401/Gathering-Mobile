import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%'
    },
    verticalSpread: {
        flex: 1,
        width: '100%',
        justifyContent: 'flex-start'
    },
    scrollWithNav: {
        flex: 1,
        width: '100%',
        justifyContent: 'center'
    },
    horizontalScroller: {
        backgroundColor: '#fff',
        fontSize: '20px',
        width: '100%'
    },
    horizontalScrollerWrapper: {
        width: 250,
        borderTopColor: 'grey',
        borderTopWidth: '1px',
        borderBottomColor: 'grey',
        borderBottomWidth: '1px',
        width: '100%'
    },
    card: {
        width: 150,
        height: 150,
        marginBottom: 15,
        padding: 0,
        textAlign: 'center',
        boxShadow: '1 2 2 black'
    },
    bigCard: {
        width: '90%',
        alignSelf: 'center',
        height: 150,
        marginBottom: 15,
        padding: 0
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
    horizontalFlex: {
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    textInput: {
        fontSize: 20,
        width: '80%',
        margin: 5,
        alignSelf: 'center',
        color: 'black'
    },
    modalButton: {
        borderWidth: 1,
        borderColor: 'grey',
        borderRadius: 30,
        margin: 5,
        padding: 10
    },
    modalButtonText: {
        fontSize: 20,
        padding: 0,
        margin: 0,
        textAlign: 'center',
        color: 'rgb(190, 190, 190)'
    },
    submitButton: {
        borderRadius: '50%',
        margin: 5,
        padding: 10,
        width: 100
    },
    hidden: {
        display: 'none'
    },
    emptyRequired: {
        color: 'red'
    },
    title: {
        fontSize: 30
    },
    button: {
        width: '50%',
        alignSelf: 'center'
    },
    navbar: {
        width: '100%',
        backgroundColor: 'green',
        height: 75,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignSelf: 'flex-end',
        justifySelf: 'flex-end'
    },
    alignCenterVertical: {
        display: 'flex',
        justifyContent: 'center'
    },
    groupTierCard: {
        borderColor: 'grey',
        borderWidth: 1,
        borderRadius: 15,
        boxShadow: '2px 2px 2px black'
    },
    costDisplay: {
        color: 'black',
        fontSize: 20
    },
    inputLabel: {
        color: 'grey',
        marginLeft: 10
    },
    errorMessage: {
        color: 'red',
        textAlign: 'center',
        fontSize: 12
    },
    eventRepeatSelection: {
        fontSize: 30,
        border: '1px solid rgb(140, 140, 140)',
        borderRadius: 15,
        padding: 15
    },
    formikStep: {
        height: '100%',
        justifyContent: 'center'
    }
});