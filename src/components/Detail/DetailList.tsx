import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FaHeart, FaPlus, FaRegHeart } from 'react-icons/fa';
import styled from 'styled-components';
import DetailRoadView from './DetailRoadView';
import DetailNeighbor from './DetailNeighbor';
import { WIDTH } from '../../utils/constants';
import { throttle } from 'lodash';
import { useTypedSelector } from '../../hooks/redux';
import DetailSise from './DetailSise';
import DetailViewOnMapButton from './DetailViewOnMapButton';
import {
    addBookMark,
    deleteBookMark,
    isBookMarked,
} from '../../hooks/bookMark';

interface Props {
    closeDetail: () => void;
}
interface menuProps {
    data_link: string;
    name: string;
}

const menus: menuProps[] = [
    {
        data_link: 'detail_header',
        name: '상세정보',
    },
    {
        data_link: 'detail_neighbor',
        name: '주변시설',
    },
    {
        data_link: 'detail_graph',
        name: '시세정보',
    },
    {
        data_link: 'detail_navigation',
        name: '길찾기',
    },
];

const THRESHOLD = 230;
const DELAY = 500;
const HEIGHTS = [0, 350, 780, 888];

const DetailList = ({ closeDetail }: Props) => {
    const { detailInfo } = useTypedSelector((state) => state.detail);
    const position = { lat: detailInfo!.y, lng: detailInfo!.x };
    const [activeMenu, setActiveMenu] = useState<string>('header');
    const [menuVisible, setMenuVisible] = useState(false);
    const [bookmarked, setBookmarked] = useState(false);
    const wrapper = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // console.log('검사');
        if (detailInfo) {
            setBookmarked(isBookMarked(detailInfo));
            console.log(isBookMarked(detailInfo));
        }
    }, [detailInfo]);

    const handleClickHeart = () => {
        if (!detailInfo) return;

        if (bookmarked) {
            setBookmarked(false);
            deleteBookMark(detailInfo);
            window.dispatchEvent(new Event('bookmarksChanged'));
        } else {
            setBookmarked(true);
            addBookMark(detailInfo);
            window.dispatchEvent(new Event('bookmarksChanged'));
        }
    };

    const handleClose = () => {
        closeDetail();
    };

    const handleMenuVisible = useCallback(
        throttle(() => {
            const scrollY = wrapper!.current!.scrollTop;

            if (scrollY >= HEIGHTS[3]) {
                setActiveMenu(menus[3].data_link);
            } else if (scrollY >= HEIGHTS[2]) {
                setActiveMenu(menus[2].data_link);
            } else if (scrollY >= HEIGHTS[1]) {
                setActiveMenu(menus[1].data_link);
            } else if (scrollY >= HEIGHTS[0]) {
                setActiveMenu(menus[0].data_link);
            }

            if (scrollY > THRESHOLD) {
                setMenuVisible(true);
            } else {
                setMenuVisible(false);
            }
        }, DELAY),
        [],
    );

    useEffect(() => {
        const wrapperElement = wrapper.current;

        if (wrapperElement) {
            wrapperElement.addEventListener('scroll', handleMenuVisible);
        }

        return () => {
            if (wrapperElement) {
                wrapperElement.removeEventListener('scroll', handleMenuVisible);
            }
        };
    }, [handleMenuVisible]);

    const handleClickMenu = (e: React.MouseEvent<HTMLUListElement>) => {
        const target = e.target as HTMLElement;
        if (target.tagName === 'LI') {
            const link = target.dataset.link;
            if (link) {
                handleScroll(link);
                setTimeout(() => {
                    setActiveMenu(link);
                }, 500);
            }
        }
    };

    const handleScroll = (name: string) => {
        const scroll = document.querySelector(`.${name}`);
        if (scroll && wrapper.current) {
            const index = menus.findIndex((menu) => menu.data_link === name);
            wrapper.current.scrollTo({
                top: HEIGHTS[index],
                behavior: 'smooth',
            });
        }
    };

    return (
        <TEST>
            <DetailListStyle
                $visible={menuVisible}
                ref={wrapper}
                className="detailList"
            >
                <ul className="menu" onClick={handleClickMenu}>
                    {menus.map((menu) => (
                        <li
                            className={
                                activeMenu === menu.data_link ? 'active' : ''
                            }
                            key={menu.data_link}
                            data-link={menu.data_link}
                        >
                            {menu.name}
                        </li>
                    ))}
                </ul>

                <div className="detail_header">
                    <h2>상세 정보</h2>
                    <div className="header_button_container">
                        <DetailViewOnMapButton position={position} />
                        <button className="bookmark" onClick={handleClickHeart}>
                            {bookmarked ? <FaHeart /> : <FaRegHeart />}
                        </button>
                        <button className="close" onClick={handleClose}>
                            <FaPlus />
                        </button>
                    </div>
                </div>
                <div className="detail_content">
                    <DetailRoadView />

                    <h2>
                        {detailInfo!.contracts[0].monthlyRent === 0
                            ? `전세 ${detailInfo!.contracts[0].deposit}`
                            : `월세 ${detailInfo!.contracts[0].deposit}/${detailInfo!.contracts[0].monthlyRent}`}
                    </h2>
                    <div className="grid">
                        <div>
                            <span>건물명 : {detailInfo!.mhouseNm}</span>
                        </div>
                        <div>
                            <span>종류 : {detailInfo!.houseType} </span>
                        </div>
                        <div>
                            <span>
                                면적 : {detailInfo!.contracts[0].excluUseAr} ㎡
                            </span>
                        </div>
                        <div>
                            <span>층 : {detailInfo!.contracts[0].floor}</span>
                        </div>
                    </div>
                </div>

                <div className="detail_neighbor">
                    <DetailNeighbor />
                </div>

                <div className="detail_graph">
                    <h2>시세 정보</h2>
                    {/* <DetailSise detailInfo={detailInfo} /> */}
                </div>

                <div className="detail_navigation">
                    <h2>길찾기</h2>
                    <div
                        style={{
                            background: 'gray',
                            width: '100%',
                            height: '300px',
                        }}
                    />
                </div>
            </DetailListStyle>
        </TEST>
    );
};

interface DetailListStyleProps {
    $visible: boolean;
}

const TEST = styled.div`
    position: fixed;
    border-radius: ${({ theme }) => theme.borderRadius.large};
    top: 0;
    left: calc(10px + ${WIDTH});
    display: flex;
    flex-direction: column;
    overflow: scroll;
    gap: 30px;
    height: 100%;
    width: ${WIDTH};
    z-index: 1001;
    padding-top: 10px;
    background: #fff;
    border-right: 1px solid ${({ theme }) => theme.colors.border};
    border-left: 1px solid ${({ theme }) => theme.colors.border};
`;

const DetailListStyle = styled.div<DetailListStyleProps>`
    position: fixed;
    border-radius: ${({ theme }) => theme.borderRadius.large};
    top: 0;
    left: calc(10px + ${WIDTH});
    display: flex;
    flex-direction: column;
    overflow: scroll;
    gap: 30px;
    height: 100%;
    width: ${WIDTH};
    z-index: 1001;
    padding-top: 10px;
    background: #fff;
    border-right: 1px solid ${({ theme }) => theme.colors.border};
    border-left: 1px solid ${({ theme }) => theme.colors.border};

    .menu {
        position: fixed;
        top: 0;
        left: calc(20px + ${WIDTH});
        margin: 0;
        width: 100%;
        height: 40px;
        padding: 0;
        visibility: ${({ $visible }) => ($visible ? 'visible' : 'hidden')};
        background: white;
        z-index: 2000;

        list-style: none;
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr;
        font-size: 14px;
        font-weight: 600;
        transition: color 0.3s ease;

        li {
            background: white;
            display: flex;
            align-items: center;
            justify-content: center;
            border-bottom: 2px solid ${({ theme }) => theme.colors.border};
            height: 100%;
            cursor: pointer;
        }

        li.active {
            border-bottom: 2px solid ${({ theme }) => theme.colors.black};
        }
    }

    h2 {
        margin: 0;
    }

    .detail_header {
        padding: 0 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;

        button {
            border: none;
            background: transparent;
            outline: none;
            cursor: pointer;

            svg {
                font-size: 1.25rem;
            }
        }

        .close {
            transform: rotate(45deg);
        }
    }

    .detail_content {
        padding: 0 10px;
        display: flex;
        flex-direction: column;
        gap: 10px;

        cursor: pointer;

        span {
            font-size: 0.875rem;
        }

        .grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
        }
    }

    .detail_neighbor {
        padding: 0 10px;
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .detail_graph {
        padding: 0 10px;
    }
    .detail_navigation {
        padding: 0 10px;
    }
`;

export default DetailList;
