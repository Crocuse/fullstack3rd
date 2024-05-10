import { useEffect, useState } from 'react';
import '../../css/include/TopArrow.css';

const TopArrow = () => {
    // Hook
    const [isTopAroow, setIsTopArrow] = useState(false);

    useEffect(() => {
        const handleIsTopArrow = () => {
            if (window.scrollY > 200) {
                setIsTopArrow(true);
            } else {
                setIsTopArrow(false);
            }
        };
        window.addEventListener('scroll', handleIsTopArrow);
    }, []);

    // Handler
    const topArrowClickHandler = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    return (
        <>
            {isTopAroow ? (
                <div id="top-arrow" onClick={topArrowClickHandler}>
                    <img src="/img/top_arrow.png" />
                </div>
            ) : null}
        </>
    );
};

export default TopArrow;
