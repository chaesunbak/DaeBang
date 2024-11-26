import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { StyledSiseList } from '../SiseList';
import { SiseOfBuildingWithXy } from '../../models/Sise.model';
import { getBookMarks } from '../../hooks/bookMark';
import BookmarkItem from './BookmarkItem';
import { useTypedDispatch, useTypedSelector } from '../../hooks/redux';
import { setDetail, setDetailOpen } from '../../store/slice/DetailSlice';
import DetailList from '../Detail/DetailList';

interface Props {
    house: SiseOfBuildingWithXy;
    index?: number;
    onClick: (house: SiseOfBuildingWithXy) => void;
}

const BookmarkList = () => {
    const [bookmarks, setBookmarks] = useState<SiseOfBuildingWithXy[]>([]);
    const { detailOpen } = useTypedSelector((state) => state.detail);
    const dispatch = useTypedDispatch();

    useEffect(() => {
        setBookmarks(getBookMarks());

        const handleStorageChange = () => {
            setBookmarks(getBookMarks());
        };

        window.addEventListener('bookmarksChanged', handleStorageChange);

        return () => {
            window.removeEventListener('bookmarksChanged', handleStorageChange);
        };
    }, []);

    const openDetail = (house: SiseOfBuildingWithXy) => {
        dispatch(setDetailOpen(true));
        dispatch(setDetail(house));
    };

    const closeDetail = () => {
        dispatch(setDetailOpen(false));
    };

    return (
        <BookmarkListStyle>
            {bookmarks && bookmarks.length > 0 ? (
                bookmarks.map((bookmark, index) => (
                    <BookmarkItem
                        key={index}
                        house={bookmark}
                        index={index}
                        onClick={() => openDetail(bookmark)}
                    />
                ))
            ) : (
                <Empty>
                    <span>북마크가 없습니다</span>
                </Empty>
            )}
            {detailOpen && <DetailList closeDetail={closeDetail} />}
        </BookmarkListStyle>
    );
};
const BookmarkListStyle = StyledSiseList;
const Empty = styled.div`
    display: flex;
    height: 100%;
    justify-content: center;
    align-items: center;
`;

export default BookmarkList;
