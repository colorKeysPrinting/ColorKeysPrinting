'use strict';

import _                        from 'lodash';
import Immutable                from 'immutable';

export function addToListHelper(state, collectionType, collectionId, productId) {
    if(collectionType === 'customMatchups') {
        let myMatchups = state.getIn(['activeUser', 'myMatchups']).toJS();
        let customMatchups = _.find(myMatchups, ['type', 'custom']);
        let matchup = _.find(customMatchups.matchups, ['id', collectionId]);

        myMatchups = _.remove(myMatchups, (matchup)=>{return matchup.type !== 'custom'}); // remove custom match from myMatchups
        customMatchups.matchups = _.remove(customMatchups.matchups, (matchup)=>{return matchup.id !== collectionId}); // remove matchup from custom matchups

        if(matchup.products[productId]) {
            matchup.products[productId] += 1;

        } else {
            matchup.products[productId] = 1;
        }

        customMatchups.matchups.push(matchup); // add the modified matchup back into custom matchups
        myMatchups.push(customMatchups); // add the full custom matchup back into myMatchups

        state = state.updateIn(['activeUser', 'myMatchups'], value=>Immutable.fromJS(myMatchups));
        console.log('current matchups:', state.getIn(['activeUser', 'myMatchups']).toJS());

        state = state.set('activeOverlay', 'addToConfirmation');
        state = state.set('overlayObj', {type: 'Matchup', collectionObj: matchup, productId});

    } else if (collectionType === 'myLists') {
        let myLists = state.getIn(['activeUser', 'myLists']).toJS();
        let index = _.findIndex(myLists, ['id', collectionId]);
        myLists[index].products.push(productId);

        state = state.updateIn(['activeUser', 'myLists'], value=>Immutable.fromJS(myLists));
        console.log('current myLists:', state.getIn(['activeUser', 'myLists']).toJS());

        state = state.set('activeOverlay', 'addToConfirmation');
        state = state.set('overlayObj', {type: 'List', collectionObj: myLists[index], productId});
    }

    return state;
}