'use strict';

import _                        from 'lodash';
import Immutable                from 'immutable';

export function addToListHelper(state, listType, listID, productID) {
    if(listType === 'customMatchups') {
        let myMatchups = state.getIn(['activeUser', 'myMatchups']).toJS();
        let customMatchups = _.find(myMatchups, ['type', 'custom']);
        let matchup = _.find(customMatchups.matchups, ['id', listID]);

        myMatchups = _.remove(myMatchups, (matchup)=>{return matchup.type !== 'custom'}); // remove custom match from myMatchups
        customMatchups.matchups = _.remove(customMatchups.matchups, (matchup)=>{return matchup.id !== listID}); // remove matchup from custom matchups

        if(matchup.products[productID]) {
            matchup.products[productID] += 1;

        } else {
            matchup.products[productID] = 1;
        }

        customMatchups.matchups.push(matchup); // add the modified matchup back into custom matchups
        myMatchups.push(customMatchups); // add the full custom matchup back into myMatchups

        state = state.updateIn(['activeUser', 'myMatchups'], value=>Immutable.fromJS(myMatchups));
        console.log('current matchups:', state.getIn(['activeUser', 'myMatchups']).toJS());

        state = state.set('activeOverlay', 'addToConfirmation');
        state = state.set('overlayObj', {type: 'Matchup', listObj: matchup, id: productID, products: matchup.products});

    } else if (listType === 'myLists') {
        let myLists = state.getIn(['activeUser', 'myLists']).toJS();
        let index = _.findIndex(myLists, ['id', listID]);
        myLists[index].products.push(productID);

        state = state.updateIn(['activeUser', 'myLists'], value=>Immutable.fromJS(myLists));
        console.log('current myLists:', state.getIn(['activeUser', 'myLists']).toJS());

        state = state.set('activeOverlay', 'addToConfirmation');
        state = state.set('overlayObj', {type: 'List', listObj: myLists[index], id: productID});
    }

    return state;
}