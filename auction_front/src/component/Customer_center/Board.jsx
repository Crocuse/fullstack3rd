const Board = () => {
    return (
        <div className="board_wrap">
            <div className="form-wrapper">
                <input className="title-input" type="text" placeholder="제목" />
                <textarea className="text-area" placeholder="내용"></textarea>
            </div>
            <button className="submit-button">입력</button>
        </div>
    );
};

export default Board;
