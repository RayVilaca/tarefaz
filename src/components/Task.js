import React from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import Icon from 'react-native-vector-icons/FontAwesome';

import moment from 'moment';
import 'moment/locale/pt-br';

import commonStyles from '../commonStyles';

export default props => {

    const doneOrNotStyle = props.doneAt != null ? { textDecorationLine: 'line-through' } : {};
    const doneOrNotColor = props.doneAt != null ? { color: commonStyles.colors.secondary } : {};

    const date = props.doneAt ? props.doneAt : props.estimateAt;
    const formattedDate = moment(date).locale('pt-br').format('ddd, D [de] MMMM');

    const getLeftContent = () => {
        return (
            <View style={styles.left}>
                <Icon name="trash" size={20} color="#FFF" style={styles.excludeIcon}/>
                <Text style={styles.excludeText}>Excluir</Text>
            </View>
        )
    }

    return (
        <Swipeable renderLeftActions={getLeftContent} onSwipeableLeftOpen={() => props.onDelete && props.onDelete(props.id)}>
            <View style={styles.container}>
                <TouchableWithoutFeedback onPress={() => props.onToggleTask(props.id)}>
                    <View style={styles.checkContainer}>
                        {getCheckView(props.doneAt)}
                    </View>
                </TouchableWithoutFeedback>

                <View>
                    <Text style={[styles.desc, doneOrNotStyle, doneOrNotColor]}>{props.desc}</Text>
                    <Text style={[styles.date, doneOrNotColor]}>{formattedDate}</Text>
                </View>
            </View>
        </Swipeable>
    );
}

function getCheckView(doneAt) {

    if (doneAt != null) {
        return (
            <View style={styles.done}>
                <Icon name='check' size={20} color='#FFF'></Icon>
            </View>
        );
    } else {
        return (
            <View style={styles.pending}></View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        borderColor: '#AAA',
        borderBottomWidth: 1,
        alignItems: 'center',
        paddingVertical: 15,
        backgroundColor: '#FFF'
    },
    checkContainer: {
        width: '20%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    pending: {
        height: 25,
        width: 25,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#555'
    },
    done: {
        height: 25,
        width: 25,
        borderRadius: 5,
        backgroundColor: '#008000',
        alignItems: 'center',
        justifyContent: 'center'
    },
    desc: {
        fontFamily: commonStyles.fontFamily,
        color: commonStyles.colors.mainText,
        fontSize: 20
    },
    date: {
        fontFamily: commonStyles.fontFamily,
        color: commonStyles.colors.subText,
        fontSize: 14

    },
    left: {
        flex: 1,
        backgroundColor: commonStyles.colors.today,
        flexDirection: 'row',
        alignItems: 'center'
    },
    excludeText: {
        fontFamily: commonStyles.fontFamily,
        color: '#FFF',
        fontSize: 20,
        margin: 10
    },
    excludeIcon: {
        marginLeft: 10
    }
});