import { useState } from 'react';
import { Formik } from 'formik';
import { View, Modal, TouchableWithoutFeedback, KeyboardAvoidingView, ScrollView } from 'react-native';
import { Button } from 'react-native-paper';

import DateInput from './inputs/DateInput';
import PriceInput from './inputs/PriceInput';
import PhoneInput from './inputs/PhoneInput';
import EmailInput from './inputs/EmailInput';
import BasicInput from './inputs/BasicInput';
import RadioGroup from './inputs/RadioGroup';
import DropDown from './inputs/DropDown';
import CardSelector from './inputs/CardSelector';
import LocationInput from './inputs/LocationInput';
import CheckboxInput from './inputs/CheckboxInput';

import { styles } from '../styles/main-styles';

export default function CustomFormik({ steps, moreInformation, setMoreInformation, formSubmit }) {
    let [currentStep, setCurrentStep] = useState(0);

    return (
        <View style={styles.container}>
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
                    <ScrollView
                        automaticallyAdjustKeyboardInsets={true}
                        centerContent={true}
                        snapToInterval={true}
                    >
                    <Formik 
                        initialValues={steps.reduce((a1, c1) => [...a1, ...c1], []).reduce((a2, c2) => {
                            return {
                                ...a2,
                                [c2.fieldName]: c2.initial,
                                ...(c2.type === 'date' ? {repeat: c2.repeat} : {})
                            }
                        }, {})}
                        onSubmit={values => formSubmit(values)}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, setFieldValue }) => (
                            <Modal>
                                {steps.map((step, index) => (
                                    <View style={index === currentStep ? styles.formikStep : styles.hidden} key={index}>
                                    {
                                        step.map((field, index2) => {
                                            switch(field.type) {
                                                case 'name':
                                                case 'text':
                                                case 'password':
                                                case 'paragraph':
                                                    return <BasicInput
                                                        handleChange={handleChange}
                                                        handleBlur={handleBlur}
                                                        placeholder={field.placeholder}
                                                        fieldName={field.fieldName}
                                                        value={values[field.fieldName]}
                                                        autoCapitalize={field.type === 'name' ? 'words' : field.type === 'paragraph' ? 'sentences' : 'none'}
                                                        secureTextEntry={field.type === 'password'}
                                                        multiline={field.type === 'paragraph'}
                                                        label={field.label}
                                                        required={field.required}
                                                        key={`0${index2}`}
                                                    />
                                                case 'phone':
                                                    return <PhoneInput
                                                        handleChange={handleChange}
                                                        handleBlur={handleBlur}
                                                        fieldName={field.fieldName}
                                                        value={values[field.fieldName]}
                                                        label={field.label}
                                                        required={field.required}
                                                        key={`0${index2}`}
                                                    />
                                                case 'date':
                                                    return <DateInput
                                                        label={field.label}
                                                        fieldName={field.fieldName}
                                                        setFieldValue={setFieldValue}
                                                        required={field.required}
                                                        key={`0${index2}`}
                                                    />
                                                case 'price':
                                                    return <PriceInput
                                                        handleChange={handleChange}
                                                        handleBlur={handleBlur}
                                                        fieldName={field.fieldName}
                                                        value={values[field.fieldName]}
                                                        label={field.label}
                                                        required={field.required}
                                                        key={`0${index2}`}
                                                    />
                                                case 'email':
                                                    return <EmailInput
                                                        handleChange={handleChange}
                                                        handleBlur={handleBlur}
                                                        fieldName={field.fieldName}
                                                        value={values[field.fieldName]}
                                                        label={field.label}
                                                        required={field.required}
                                                        key={`0${index2}`}
                                                    />
                                                case 'radio':
                                                    return <RadioGroup
                                                        label={field.label}
                                                        options={field.options}
                                                        checked={field.checked}
                                                        setChecked={field.setChecked}
                                                        required={field.required}
                                                        key={`0${index2}`}
                                                    />
                                                case 'dropdown':
                                                    return <DropDown
                                                        label={field.label}
                                                        options={field.options}
                                                        setOptions={field.setOptions}
                                                        selected={field.selected}
                                                        setSelected={field.setSelected}
                                                        required={field.required}
                                                        key={`0${index2}`}
                                                    />
                                                case 'cards':
                                                    return <CardSelector
                                                        label={field.label}
                                                        cards={field.cards}
                                                        selectedCard={field.selectedCard}
                                                        setSelectedCard={field.setSelectedCard}
                                                        key={`0${index2}`}
                                                    />
                                                case 'location':
                                                    return <LocationInput
                                                        label={field.label}
                                                        placeholder={field.placeholder}
                                                        fieldName={field.fieldName}
                                                        value={field.value}
                                                        handleBlur={handleBlur}
                                                        setFieldValue={setFieldValue}
                                                        required={field.required}
                                                        key={`0${index2}`}
                                                    />
                                                case 'checkbox':
                                                    return <CheckboxInput
                                                        label={field.label}
                                                        handleChange={handleChange}
                                                        fieldName={field.fieldName}
                                                        key={`0${index2}`}
                                                    />
                                                default:
                                                    throw('Unknown input type');
                                            }
                                        })
                                    }
                                    {
                                        setMoreInformation && 
                                            <Button onPress={() => setMoreInformation(!moreInformation)} mode="outlined">
                                                {moreInformation ? "Less Information" : "More Information"}
                                            </Button>
                                    }
                                    {
                                        index === steps.length - 1 ? 
                                        <Button style={styles.button} onPress={handleSubmit} mode="outlined">Submit</Button> :
                                        <Button style={styles.button} onPress={() => setCurrentStep(currentStep + 1)} mode="outlined">Continue</Button>
                                    }
                                    </View>
                                ))}
                            </Modal>
                        )}
                    </Formik>
                    </ScrollView>
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
        </View>
    )
}
