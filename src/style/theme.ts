type Colorkey =
    | 'primary'
    | 'secondary'
    | 'third'
    | 'forth'
    | 'lightBackground'
    | 'neutralBackground'
    | 'darkBackground'
    | 'text'
    | 'border'
    | 'hover';

type HeadingSize = 'large' | 'medium' | 'small';
type LayoutWidth = 'small' | 'medium' | 'large';

interface Theme {
    name: string;
    colors: Record<Colorkey, string>;
    heading: {
        [key in HeadingSize]: {
            fontSize: string;
        };
    };
    borderRadius: {
        default: string;
        large: string;
    };
    layout: {
        width: {
            [key in LayoutWidth]: string;
        };
    };
}

export const theme: Theme = {
    name: 'main',
    colors: {
        primary: '#64B5F6',
        secondary: '#6B95BC',
        third: '#D5A667',
        forth: '#9C7236',
        lightBackground: '#F2FAFF',
        neutralBackground: '#9FADBD',
        darkBackground: '#3B4856',
        text: '#3B4856',
        border: '#EDEDED',
        hover: '#EFF4FA',
    },
    heading: {
        large: {
            fontSize: '2rem',
        },
        medium: {
            fontSize: '1.5rem',
        },
        small: {
            fontSize: '1rem',
        },
    },
    borderRadius: {
        default: '4px',
        large: '8px',
    },
    layout: {
        width: {
            small: '320px',
            medium: '760px',
            large: '1020px',
        },
    },
};
