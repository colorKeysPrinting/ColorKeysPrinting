'use strict';

import _                        from 'lodash';
import Immutable                from 'immutable';

export default function addToListHelper(state, collectionType, collectionId, productId) {
    if (collectionType === 'customMatchups') {
        let myMatchups = state.getIn(['activeUser', 'myMatchups']).toJS();
        const customMatchups = _.find(myMatchups, ['type', 'custom']);
        const matchup = _.find(customMatchups.matchups, ['id', collectionId]);

        myMatchups = _.remove(myMatchups, (matchup) => matchup.type !== 'custom'); // remove custom match from myMatchups
        customMatchups.matchups = _.remove(customMatchups.matchups, (matchup) => matchup.id !== collectionId); // remove matchup from custom matchups

        if (matchup.products[productId]) {
            matchup.products[productId] += 1;

        } else {
            matchup.products[productId] = 1;
        }

        customMatchups.matchups.push(matchup); // add the modified matchup back into custom matchups
        myMatchups.push(customMatchups); // add the full custom matchup back into myMatchups

        state = state.updateIn(['activeUser', 'myMatchups'], value => Immutable.fromJS(myMatchups));
        console.log('current matchups:', state.getIn(['activeUser', 'myMatchups']).toJS());

        state = state.set('activeOverlay', 'addToConfirmation');
        state = state.set('overlayObj', { type: 'Matchup', collectionObj: matchup, productId });

    } else if (collectionType === 'myLists') {
        const myLists = state.getIn(['activeUser', 'myLists']).toJS();
        const index = _.findIndex(myLists, ['id', collectionId]);
        myLists[index].products.push(productId);

        state = state.updateIn(['activeUser', 'myLists'], value => Immutable.fromJS(myLists));
        console.log('current myLists:', state.getIn(['activeUser', 'myLists']).toJS());

        state = state.set('activeOverlay', 'addToConfirmation');
        state = state.set('overlayObj', { type: 'List', collectionObj: myLists[index], productId });
    }

    return state;
}