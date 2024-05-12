const initialState = {
    message : { id: '', message: '', name: '', date: ''}
}

const overBidReducer = (state = initialState, action) => {
    console.log('overBidReducer', action);
    switch(action.type) {
        case 'SET_OVER_BID_MSG':
            console.log("리듀서 들어오나나ㅏㅏㅏㅏㅏㅏㅏ", action)
            return {
                ...state,
                message: action.payload
            };

        default:
            return state;
    }
}

export default overBidReducer;