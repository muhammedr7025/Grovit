import React from 'react'
import { View, Text, Image, TouchableOpacity, Dimensions, Modal, Vibration } from 'react-native'
import { Button, Icon } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';
import { openDatabase } from 'react-native-sqlite-storage';
import { Dialogflow_V2 } from 'react-native-dialogflow';
import SpeechAndroid from 'react-native-android-voice'
import Tts from 'react-native-tts'
import styles from '../assets/styles';

var moment = require('moment');
var db = openDatabase({ name: 'GreenHouse.db' });
const height = Dimensions.get('window').height

const Card = ({ badge, icon, color, patch, onpress }) => {
    return (
        <TouchableOpacity onPress={onpress} style={[styles.details_card, { backgroundColor: color }]}>
            <View style={{ flex: 3 }}>
                <View style={{ flex: 0.5 }}></View>
                <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', flex: 1 }}>
                        <View style={{ flex: 2 }}>
                            <Icon name={icon} type={'feather'} size={40} color={color === 'white' ? 'black' : 'white'} />
                        </View>
                        <View style={{ flex: 1 }}></View>
                        <View style={{ flex: 1 }}></View>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <View style={{ flex: patch, alignItems: 'flex-end' }}>
                            <Text style={[styles.details_card_badge, { color: color === 'white' ? 'black' : 'white' }]}>{badge}</Text>
                        </View>
                        <View style={{ flex: 1 }}></View>
                    </View>
                </View>
            </View>
            <View style={{ flex: 1, alignItems: 'center' }}>
            </View>
        </TouchableOpacity>
    );
}

export default Details = ({ route, navigation }) => {
    const date = new Date()
    const { item } = route.params;
    const { trigger } = route.params;
    let [modal, show_modal] = React.useState(false);
    let [message, set_message] = React.useState('')
    let [response, set_response] = React.useState('')
    React.useEffect(() => {
        if (trigger) {
            show_modal(true)
            listen()
        } else { }
    }, [])
    const listen = async () => {
        set_message('')
        set_response('')
        try {
            const spoken = await SpeechAndroid.startSpeech("Talk to Grovi", SpeechAndroid.ENGLISH_INDIA);
            set_message(spoken)
            Dialogflow_V2.requestQuery(
                spoken,
                result => speak(result),
                error => console.log(error)
            );
        } catch (error) {
            show_modal(false)
        }
    }
    const speak = (response) => {
        if (response.queryResult.fulfillmentText) {
            console.log("Response: " + response.queryResult.fulfillmentText)
            console.warn("Intent triggered: " + response.queryResult.intent.displayName)
            switch (response.queryResult.intent.displayName) {
                default:
                    set_response(response.queryResult.fulfillmentText)
                    Tts.speak(response.queryResult.fulfillmentText)
            }
        } else {
            const error_message = "Sorry, I'm not confident enough to answer that. Please try again."
            set_response(error_message)
            Tts.speak(error_message)
            const evnt = Tts.addEventListener('tts-finish', () => listen());
            return evnt;
        }
    }
    React.useEffect(() => {
        Dialogflow_V2.setConfiguration(
            "csinapp@grovi-nwg9.iam.gserviceaccount.com",
            "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDLeeC/JXItnpJh\nL8aXmBrcbF3SmdG04trZAIuvs0CSBN3EJ4434J+OPvTQDG5OV2gkezHRWFO1rrQt\nbomQAFInCvrXrkpErVUQl0UsgXEI2op0ibYC8TPpr7tEl4M/aYazh4/s1sA99BkR\nX+TsydXAxT0hmItrxQ4hvKf+u8sRaclal77ktfnKMy683P4ZQtITLSLnL3vp4SDn\nK4qukYZFw6K7+V8j3MiEIjT+ijhd3NK3nUju4AKa2cdyVPK04raHMeIFjahrvzY8\nYkKqbRr8r8EU6FPW4+vQErEwxh2zN1j5HwDl9KjHlxzv4PEpn6oCrKW7dIrSkmvz\namgEEzHnAgMBAAECggEAAdYacTpCIjschHfeTBy27QmR8pUCL5LjAzMeI04vEbEP\n2+vfxnnJCBUTEGLXaT1vUd4yc+bVKy9vmomrYsUVWy7ZL1AL57JOACbekrgFkr+T\nFzwoeHAE/Yj+tIOxO3cLV6FxL+2esXVd91GjPB2vvch7JcGgTC8T8BxQwpbGhMbZ\nvJeRZgPlO9np4+3PKBNwUDFUcuKG5pdU/MPvDHZXobYF1nmif76/2bx6yyn12Ari\nLLRuGOvnRAj9tGScJjQzus2RzJIMYa1KeOBXNkbK8WhXKgwOy4tWYArzYz7Je+tn\nnyiZhp+fvS1uO+QJa0vmsC653FGRSnTznG0OMDpgiQKBgQDxhg2WviT/TUodWaER\nTpKiRI3FpHlPMiNgDLvX8lrEb0UFo9+Fx4+E8b6GKAN1T7V1ftDpIpcREW6CfpZQ\nOQq2a+Bc/mhY6vsQajGmPnyhiMyJO7alZUudNB14tQwprkTXa/+SuuEd510iHLc/\ntaRcaU2aAW6hGifJ+GCWmH45JQKBgQDXrAWVPJz03vcHu9xERbgs51CcqO+IoCJ8\nDvE6Gt3rqm3lOigCpcZUpDEt4HzvzTbzqEW3vhnq3wptzfPe5MTAch7RccDqaDyk\nVWrN9nmV1SaXZt17V7wIj1Ta+YDWYZY/DT5MLZM8WpwNoVZXA723Gxs9am5LD/m8\nUcf+4KIPGwKBgDSPTam+W2LLuRNGDA0uIi756DhYoKWhbZ1baA2IikQxSr39eYkt\ncogl66ZaUtZWsFCPdnslseZe+sOfNKrknvYv57WVD7Q5/sUFtyRMeObWVFyRCCBa\nOOhPDRLVo332lLikoguWa6MMVHI1+ZL9vnT13ZNkOGUKwhnr2WksaluZAoGBALQ4\nPwISAGZu2qZPySQTzm9Xa/k9Acx9Y9Oe+NzBDqibZfGiw0RTGoQoICBh8oTASycY\negmshSPK9YAEFcEwEWlu82m5UKeQKvx3lCQ/ziHyV6k0f+dNzQaqHxJMY+jA6zgM\n7P3jJ6HLZZPOOcPEkIet0vljMn7u/pTrEeBd/Y35AoGAKcuFzoD3ZOL7zlT+iC9e\nSnGmoub9c2OpstWhqASRzBb/MsF89hEoT+yCXGcLozqf0KRXJJ7oWMOhKBwkcSv/\ntkVMvj5QoV9XdWmcSNSo7pr6YM4HNzm11xtDi2htxEaHUdCzArVrUGi0cQrNq+Dv\nDNgV4lp0MvPDgeIZj+m3KSI=\n-----END PRIVATE KEY-----\n",
            Dialogflow_V2.LANG_ENGLISH_US,
            "grovi-nwg9"
        )
    }, [])
    return (
        <View style={{ flex: 1 }}>
            <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 10 }}>
                <View style={styles.details_image_container}>
                    <Image
                        source={require('../img/GreenHouse.jpg')}
                        style={styles.details_image}
                    />
                </View>
                <View style={{ flex: 1 }}>
                    <View style={styles.details_cards_container}>
                        <Card badge={'Lighting'} icon={'sun'} onpress={() => navigation.navigate('Lighting', { item: item })} color={global.accent} patch={1.2} />
                        <Card badge={'Watering'} icon={'droplet'} onpress={() => navigation.navigate('Watering', { item: item })} color={global.accent} patch={1.4} />
                    </View>
                    <View style={[styles.details_cards_container]}>
                        <Card badge={'To Do'} icon={'bar-chart'} onpress={() => navigation.navigate('To-Do', { item: item })} color={'white'} patch={0.8} />
                        <Card badge={'Analytics'} icon={'activity'} onpress={() => navigation.navigate('Analytics', { item: item })} color={'white'} patch={1.4} />
                    </View>
                </View>
            </ScrollView>
            <View style={styles.mic_button_container}>
                <Button
                    buttonStyle={[styles.addButton, { backgroundColor: global.accent, marginBottom: height / 8 }]}
                    icon={
                        <Icon name='mic' type='material' size={40} color='white' />
                    }
                    onPress={async () => {
                        Vibration.vibrate(40);
                        show_modal(true);
                        listen()
                    }}
                />
            </View>
            <Modal
                animationType={'fade'}
                transparent={true}
                visible={modal}
            >
                <View style={styles.modal}>
                    <View style={{ flex: 1 }}></View>
                    <View style={{ flex: 1.5, alignItems: 'center' }}>
                        <View style={styles.assistant_prompt}>
                            <View style={{ flex: 2, flexDirection: 'row' }}>
                                <View style={{ flex: 3, justifyContent: 'center', alignItems: 'flex-end' }}>
                                    <Image
                                        source={require('../img/logo.png')}
                                        style={{ height: 40, width: 40, marginTop: 10 }}
                                    />
                                </View>
                                <View style={{ flex: 9, justifyContent: 'center' }}>
                                    <Text style={styles.assistant_name}>GROVI</Text>
                                </View>
                                <Button
                                    buttonStyle={{ flex: 2, backgroundColor: 'transparent', marginRight: 20, marginTop: 20 }}
                                    icon={
                                        <Icon name={'close'} type={'material'} color={'grey'} size={30} />
                                    }
                                    onPress={() => show_modal(false)}
                                />
                            </View>
                            <View style={{ flex: 4 }}>
                                <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                    {message ?
                                        <View style={styles.message}>
                                            <Text style={styles.message_text}>{message}</Text>
                                        </View> : null}
                                </View>
                                <View style={{ flex: 1 }}>
                                    {response ?
                                        <View style={[styles.message, { backgroundColor: global.accent, marginRight: 40 }]}>
                                            <Text style={[styles.message_text, { marginLeft: 10 }]}>{response}</Text>
                                        </View> : null}
                                </View>
                            </View>
                            <View style={{ flex: 4, justifyContent: 'center' }}>
                                <Button
                                    buttonStyle={{ width: 80, alignSelf: 'center', backgroundColor: 'transparent' }}
                                    icon={
                                        <Icon name={'mic'} type={'material'} color={'grey'} size={40} />
                                    }
                                    onPress={() => {
                                        listen()
                                    }}
                                />
                            </View>
                        </View>
                    </View>
                    <View style={{ flex: 1 }}></View>
                </View>
            </Modal>
        </View>
    );
}