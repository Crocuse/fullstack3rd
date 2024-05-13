const initialState = {
    message: { id: '', message: '', name: '', date: '' }
}

const overBidReducer = (state = initialState, action) => {
    console.log('OVERBID REDUCER');
    switch (action.type) {
        case 'SET_OVER_BID_MSG':
            return {
                ...state,
                message: action.payload
            };

        default:
            return state;
    }
}

export default overBidReducer;