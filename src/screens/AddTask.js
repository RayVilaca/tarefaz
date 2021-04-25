import React, { Component } from 'react';
import { Platform, Modal, Text, View, StyleSheet, TouchableWithoutFeedback, TouchableOpacity, TextInput } from 'react-native';

import moment from 'moment';
import DateTimePicker from '@react-native-community/datetimepicker';

import commonStyles from '../commonStyles';

const initialState = { desc: '', date: new Date(), showDatePicker: false };

export default class AddTask extends Component {

    state = {
        ...initialState
    }

    save = () => {
        const newTask = {
            desc: this.state.desc,
            date: this.state.date,
        }

        this.props.onSave && this.props.onSave(newTask);
        this.setState({ ...initialState })
    }

    getDatePicker = () => {
        let datePicker = <DateTimePicker value={this.state.date} onChange={(_, date) => this.setState({ date, showDatePicker: false })} mode='date' />

        const dateString = moment(this.state.date).format('ddd, D [de] MMMM [de] YYYY');

        if (Platform.OS === 'android') {
            datePicker = (
                <View>
                    <TouchableOpacity onPress={() => this.setState({ showDatePicker: true })}>
                        <Text style={styles.date}>
                            {dateString}
                        </Text>
                    </TouchableOpacity>

                    {this.state.showDatePicker && datePicker}

                </View>
            )
        }

        return datePicker;

    }

    render() {
        return (
            <Modal transparent={true} visible={this.props.isVisible} onRequestClose={this.props.onCancel} animationType='slide' >
                <View style={styles.modalContainer}>
                    <TouchableWithoutFeedback onPress={this.props.onCancel}>
                        <View style={styles.background}>

                        </View>
                    </TouchableWithoutFeedback>
                    <View style={styles.container}>
                        <Text style={styles.header}>Nova Tarefa</Text>
                        <TextInput style={styles.input} placeholder="O que pretende fazer?" onChangeText={desc => this.setState({ desc })} value={this.state.desc} />
                        {this.getDatePicker()}
                        <View style={styles.buttons}>
                            <TouchableOpacity onPress={this.props.onCancel}>
                                <Text style={styles.button}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={this.save}>
                                <Text style={styles.button}>Salvar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <TouchableWithoutFeedback onPress={this.props.onCancel}>
                        <View style={styles.background}>

                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    background: {
        flex: 1
    },
    container: {
        backgroundColor: '#FFF',
        borderRadius: 15,
        borderWidth: 1,
        borderColor: 'purple'
    },
    header: {
        fontFamily: 'Lobster-Regular',
        backgroundColor: commonStyles.colors.today,
        color: commonStyles.colors.secondary,
        textAlign: 'center',
        padding: 15,
        fontSize: 22,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    input: {
        fontFamily: commonStyles.fontFamily,
        height: 40,
        margin: 15,
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#E3E3E3',
        borderRadius: 6
    },
    button: {
        margin: 20,
        marginRight: 30,
        color: commonStyles.colors.today,
        fontSize: 20,
        fontFamily: commonStyles.fontFamily,
    },
    date: {
        fontFamily: commonStyles.fontFamily,
        fontSize: 20,
        marginLeft: 15
    }
})