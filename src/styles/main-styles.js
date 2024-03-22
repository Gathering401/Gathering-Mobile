import { StyleSheet } from "react-native";
// COLORS: #042A2B, #5EB1BF, #CDEDF6, #EF7B45, #D84727 --- https://coolors.co/042a2b-5eb1bf-cdedf6-ef7b45-d84727
export const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#CDEDF6',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%'
    },
    detailsPage: {
        flexGrow: 1,
        backgroundColor: '#CDEDF6',
        alignItems: 'center',
        justifyContent: 'space-around',
        alignSelf: 'center',
        width: '90%'
    },
    details: {
        alignItems: 'center'
    },
    calendarContainer: {
        flex: 1,
        backgroundColor: '#CDEDF6',
        justifyContent: 'space-around',
        width: '100%'
    },
    calendar: {
        borderRadius: 10,
        width: '90%',
        alignSelf: 'center'
    },
    verticalSpread: {
        flex: 1,
        width: 'auto',
        justifyContent: 'flex-start'
    },
    scrollWithNav: {
        flex: 1,
        width: '90%',
        alignSelf: 'center',
        justifyContent: 'center'
    },
    horizontalScroller: {
        fontSize: '20px',
        width: 'auto',
        padding: 5
    },
    horizontalScrollerWrapper: {
        borderTopColor: 'grey',
        borderTopWidth: '1px',
        borderBottomColor: 'grey',
        width: '100%'
    },
    card: {
        width: 200,
        height: 150,
        marginRight: 10,
        textAlign: 'center'
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
        color: 'rgb(125, 125, 125)',
        margin: 10
    },
    horizontalFlex: {
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    textInput: {
        fontSize: 16,
        width: '80%',
        margin: 5,
        alignSelf: 'center',
        color: 'rgb(190, 190, 190)',
        borderRadius: 5
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
        fontSize: 30,
        alignSelf: 'flex-start',
        width: '100%'
    },
    button: {
        width: '50%',
        alignSelf: 'center'
    },
    navbar: {
        width: 'auto',
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
        fontSize: 12,
        alignSelf: 'center',
        width: '80%'
    },
    eventRepeatSelection: {
        fontSize: 30,
        border: '1px solid rgb(140, 140, 140)',
        borderRadius: 15,
        padding: 15
    },
    form: {
        width: '100%',
        flexGrow: 1,
        justifyContent: 'center'
    },
    formikStep: {
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        backgroundColor: '#CDEDF6'
    },
    radioGroupContainer: {
        alignSelf: 'center',
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    radioAndLabelContainer: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    checkbox: {
        width: '80%',
        borderWidth: 1,
        borderColor: 'grey',
        borderRadius: 5,
        height: 50,
        backgroundColor: 'white',
        margin: 12,
        fontSize: 16,
        color: 'rgb(190, 190, 190)',
        alignSelf: 'center',
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    locationSearched: {
        width: '80%',
        backgroundColor: 'white',
        alignSelf: 'center',
        paddingVertical: 5,
        paddingHorizontal: 15,
        display: 'flex',
        borderStyle: 'solid',
        borderColor: 'grey',
        borderWidth: 1,
        borderRadius: 5
    },
    dropDown: {
        width: '80%',
        alignSelf: 'center',
        marginTop: 10,
        marginBottom: 5,
        borderColor: 'rgb(190, 190, 190)',
        borderRadius: 5
    },
    dropDownContainer: {
        width: '80%',
        alignSelf: 'center',
        marginTop: 10,
        borderBottomRadius: 5,
        borderTopWidth: 0,
        borderColor: 'rgb(190, 190, 190)'
    },
    dropDownLabels: {
        color: 'rgb(75, 75, 75)',
        fontSize: 16
    }
});