import styled from 'styled-components';
import { Link, useParams } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';
import { HiMiniBuildingOffice } from 'react-icons/hi2';
import { MdApartment } from 'react-icons/md';
import { CiBookmark } from 'react-icons/ci';
import { GiConfrontation } from 'react-icons/gi';
import { useLocation } from 'react-router-dom';
import { useTypedDispatch, useTypedSelector } from '../hooks/redux';
import { toggleFilter } from '../store/slice/filterSlice';

interface ICategory {
    name: string;
    value: string;
    icon: JSX.Element;
}

const CATEGORY_LIST: ICategory[] = [
    { name: '원/투룸', value: 'onetwo', icon: <FaHome /> },
    { name: '오피스텔', value: 'officetel', icon: <HiMiniBuildingOffice /> },
    { name: '아파트', value: 'apt', icon: <MdApartment /> },
    { name: '북마크', value: 'bookmark', icon: <CiBookmark /> },
    { name: '시세비교', value: 'compare', icon: <GiConfrontation /> },
];

const CategoryBar = () => {
    const location = useLocation();
    const dispatch = useTypedDispatch();
    const filters = useTypedSelector((state) => state.filters);
    const currentPath = location.pathname.split('/')[1];
    const handleCheckboxChange = (filter: string) => {
        dispatch(toggleFilter(filter));
    };

    return (
        <StyledCategoryBar>
            <StyledLink to="/" $isActive={false}>
                <LogoText>
                    <span>⌂대방</span>
                </LogoText>
            </StyledLink>
            <nav>
                <ul>
                    {CATEGORY_LIST.map((item) => {
                        return (
                            <li key={item.value}>
                                <StyledLink
                                    to={{
                                        pathname: `/${item.value}`,
                                        search: location.search,
                                    }}
                                    $isActive={item.value === currentPath}
                                >
                                    {item.icon}
                                    <span>{item.name}</span>
                                </StyledLink>
                            </li>
                        );
                    })}
                </ul>
            </nav>
            {/* 체크박스 섹션 */}
            <FilterSection>
                <label>
                    <input
                        type="checkbox"
                        checked={filters.includes('월세')}
                        onChange={() => handleCheckboxChange('월세')}
                    />
                    월세
                </label>
                <label>
                    <input
                        type="checkbox"
                        checked={filters.includes('전세')}
                        onChange={() => handleCheckboxChange('전세')}
                    />
                    전세
                </label>
            </FilterSection>
        </StyledCategoryBar>
    );
};

const StyledCategoryBar = styled.header`
    display: flex;
    flex-direction: column;
    width: 5rem;
    min-height: 100vh;
    padding-left: 0.2rem;
    padding-right: 0.2rem;
    background-color: white;
    z-index: 300;

    nav {
        ul {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 1rem;
            list-style: none;
        }
    }
`;

const FilterSection = styled.div`
    margin-top: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;

    label {
        display: flex;
        align-items: center;
        font-size: 0.9rem;
        font-weight: 500;
    }

    input[type='checkbox'] {
        margin-right: 0.5rem;
        cursor: pointer;
    }
`;

interface StyledLinkProps {
    $isActive: boolean;
}

const StyledLink = styled(Link)<StyledLinkProps>`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 4.5rem;
    height: 4.5rem;
    border-radius: ${({ theme }) => theme.borderRadius.default};
    color: ${({ $isActive }) => ($isActive ? 'white' : '#4b5563')};
    background-color: ${({ $isActive, theme }) =>
        $isActive ? theme.colors.blue : 'white'};
    gap: 0.25rem;
    transition: color 0.3s ease;
    font-weight: 700;
    font-size: 1.5rem;

    &:hover {
        color: ${({ theme }) => theme.colors.blue};
        font-weight: 800;
        background-color: rgb(237, 237, 237);
    }

    svg {
        path {
            color: inherit;
        }
    }

    span {
        color: inherit;
        font-size: 0.75rem;
        text-align: center;
    }
`;

const LogoText = styled.h1`
    position: relative;
    width: 100px;
    height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    isolation: isolate;

    span {
        position: relative;
        z-index: 2;
        font-size: 1.5rem;
    }

    &::after {
        content: '';
        position: absolute;
        left: 50%;
        bottom: 35%;
        transform: translateX(-50%) skew(-12deg);
        width: 55px;
        height: 10px;
        background-color: rgba(59, 130, 246, 0.3);
        z-index: 1;
        transition: all 0.3s ease;
    }

    &:hover::after {
        background-color: rgba(59, 130, 246, 0.5);
        transform: translateX(-50%) skew(-43deg);
    }
`;

export default CategoryBar;
