import React, { Component } from 'react';
import { Alert, View, Text, ImageBackground, StyleSheet, FlatList, TouchableOpacity, Platform } from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';

import moment from 'moment';
import 'moment/locale/pt-br';

import Task from '../components/Task';
import commonStyles from '../commonStyles';
import AddTask from './AddTask';
import todayImage from '../../assets/imgs/today.png';

const initialState = {
    showDoneTaks: true,
    showAddTask: false,
    visibleTasks: [],
    tasks: []
};

export default class TaskList extends Component {

    state = {
       ...initialState
    }

    componentDidMount = async () => {
        const stateString = await AsyncStorage.getItem('tasksState');
        const state = JSON.parse(stateString) || initialState;

        this.setState(state, this.filterTasks);
    }

    toggleFilter = () => {
        this.setState({ showDoneTaks: !this.state.showDoneTaks }, this.filterTasks);
    }

    isPending = task => {
        return task.doneAt === null;
    }

    filterTasks = () => {
        let visibleTasks = null;

        if (this.state.showDoneTaks) {
            visibleTasks = [... this.state.tasks];
        } else {
            visibleTasks = this.state.tasks.filter(this.isPending);
        }

        this.setState({ visibleTasks });
        AsyncStorage.setItem('tasksState', JSON.stringify(this.state));
    }

    toggleTask = taskId => {
        const tasks = [...this.state.tasks];
        tasks.forEach(task => {
            if (task.id == taskId) {
                task.doneAt = task.doneAt ? null : new Date();
            }
        });

        this.setState({ tasks }, this.filterTasks);
    }

    addTask = newTask => {
        if (!newTask.desc || !newTask.desc.trim()) {
            Alert.alert('Dados inválidos', 'Descrição não informada!');
            return
        }

        const tasks = [...this.state.tasks];
        tasks.push({
            id: Math.random(),
            desc: newTask.desc,
            estimateAt: newTask.date,
            doneAt: null
        });

        this.setState({ tasks, showAddTask: false }, this.filterTasks);
    }

    deleteTask = id => {
        const tasks = this.state.tasks.filter(task => task.id !== id);
        this.setState({ tasks }, this.filterTasks);
    }

    render() {
        const today = moment().local('pt-br').format("ddd, D [de] MMMM");
        return (
            <View style={styles.container}>
                <AddTask isVisible={this.state.showAddTask} onCancel={() => this.setState({ showAddTask: false })} onSave={this.addTask} />
                <ImageBackground source={todayImage} style={styles.background}>
                    <View style={styles.iconBar}>
                        <TouchableOpacity onPress={this.toggleFilter}>
                            <Icon name={this.state.showDoneTaks ? 'eye' : 'eye-slash'} size={30} color={commonStyles.colors.secondary} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.titleBar}>
                        <Text style={styles.title}>Hoje</Text>
                        <Text style={styles.subtitle}>{today}</Text>
                    </View>
                </ImageBackground>
                <View style={styles.taskList}>
                    <FlatList data={this.state.visibleTasks} keyExtractor={item => `${item.id}`} renderItem={({ item }) => <Task {...item} onToggleTask={this.toggleTask} onDelete={this.deleteTask} />} />
                </View>

                <TouchableOpacity style={styles.addButton} onPress={() => this.setState({ showAddTask: true })} activeOpacity={0.7}>
                    <Icon name="plus" size={28} color={'white'} />
                </TouchableOpacity>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    background: {
        flex: 3.2,
    },
    taskList: {
        flex: 6.8,
    },
    titleBar: {
        flex: 1,
        justifyContent: 'flex-end'
    },
    title: {
        fontFamily: 'Lobster-Regular',
        fontSize: 50,
        marginLeft: 20,
        marginBottom: 20
    },
    subtitle: {
        fontFamily: 'Lobster-Regular',
        fontSize: 20,
        marginLeft: 20,
        marginBottom: 30
    },
    iconBar: {
        flexDirection: 'row',
        marginHorizontal: 20,
        justifyContent: 'flex-end',
        marginTop: Platform.OS == 'ios' ? 40 : 10
    },
    addButton: {
        position: 'absolute',
        right: 30,
        bottom: 30,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: commonStyles.colors.today,
        justifyContent: 'center',
        alignItems: 'center'
    }
});