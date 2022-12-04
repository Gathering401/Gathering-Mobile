import React, { useState } from 'react';

import { Formik } from 'formik';
import { Button, View } from 'react-native';

import DateInput from './inputs/DateInput';
import PriceInput from './inputs/PriceInput';
import PhoneInput from './inputs/PhoneInput';
import EmailInput from './inputs/EmailInput';
import BasicInput from './inputs/BasicInput';
import ParagraphInput from './inputs/ParagraphInput';
import RadioGroup from './inputs/RadioGroup';

import { styles } from '../styles/main-styles';

export default function CustomFormik({ steps, formSubmit }) {
    let [currentStep, setCurrentStep] = useState(0);

    return (
        <Formik 
            initialValues={steps.reduce((a1, c1) => [...a1, ...c1], []).reduce((a2, c2) => {
                return {
                    ...a2,
                    [c2.fieldName]: c2.initial
                }
            }, {})}
            onSubmit={values => formSubmit(values)}
        >
            {({ handleChange, handleBlur, handleSubmit, values }) => (
                <View>
                    {steps.map((step, index) => (
                        <View style={index === currentStep ? {} : styles.hidden} key={index}>
                        {
                            step.map((field, index2) => {
                                // console.log(index === steps.length - 1, index2 === step.length - 1, field.fieldName)
                                switch(field.type) {
                                    case 'name':
                                        return <BasicInput
                                            handleChange={handleChange}
                                            handleBlur={handleBlur}
                                            placeholder={field.placeholder}
                                            fieldName={field.fieldName}
                                            value={values[field.fieldName]}
                                            autoCapitalize="words"
                                            secureTextEntry={false}
                                            label={field.label}
                                            key={`0${index2}`}
                                        />
                                    case 'text':
                                        return <BasicInput
                                            handleChange={handleChange}
                                            handleBlur={handleBlur}
                                            placeholder={field.placeholder}
                                            fieldName={field.fieldName}
                                            value={values[field.fieldName]}
                                            autoCapitalize="none"
                                            secureTextEntry={false}
                                            label={field.label}
                                            key={`0${index2}`}
                                        />
                                    case 'password':
                                        return <BasicInput
                                            handleChange={handleChange}
                                            handleBlur={handleBlur}
                                            placeholder={field.placeholder}
                                            fieldName={field.fieldName}
                                            value={values[field.fieldName]}
                                            autoCapitalize="none"
                                            secureTextEntry={true}
                                            label={field.label}
                                            key={`0${index2}`}
                                        />
                                    case 'paragraph':
                                        return <ParagraphInput
                                            handleChange={handleChange}
                                            handleBlur={handleBlur}
                                            placeholder={field.placeholder}
                                            fieldName={field.fieldName}
                                            value={values[field.fieldName]}
                                            label={field.label}
                                            key={`0${index2}`}
                                        />
                                    case 'phone':
                                        return <PhoneInput
                                            handleChange={handleChange}
                                            handleBlur={handleBlur}
                                            fieldName={field.fieldName}
                                            value={values[field.fieldName]}
                                            label={field.label}
                                            key={`0${index2}`}
                                        />
                                    case 'date':
                                        return <DateInput
                                            handleChange={handleChange}
                                            handleBlur={handleBlur}
                                            fieldName={field.fieldName}
                                            value={values[field.fieldName]}
                                            label={field.label}
                                            key={`0${index2}`}
                                            date={field.date}
                                            setDate={field.setDate}
                                        />
                                    case 'price':
                                        return <PriceInput
                                            handleChange={handleChange}
                                            handleBlur={handleBlur}
                                            fieldName={field.fieldName}
                                            value={values[field.fieldName]}
                                            label={field.label}
                                            key={`0${index2}`}
                                        />
                                    case 'email':
                                        return <EmailInput
                                            handleChange={handleChange}
                                            handleBlur={handleBlur}
                                            fieldName={field.fieldName}
                                            value={values[field.fieldName]}
                                            label={field.label}
                                            key={`0${index2}`}
                                        />
                                    case 'radio':
                                        return <RadioGroup
                                            handleChange={handleChange}
                                            fieldName={field.fieldName}
                                            value={values[fieldName]}
                                            label={field.label}
                                            options={field.options}
                                            key={`0${index2}`}
                                        />
                                    default:
                                        throw('Unknown input type');
                                }
                            })
                        }
                        {
                            index === steps.length - 1 ? 
                            <Button title="Submit" onPress={handleSubmit}/> :
                            <Button onPress={() => setCurrentStep(currentStep + 1)} title="Continue" />
                        }
                        </View>
                    ))}
                </View>
            )}
        </Formik>
    )
}
