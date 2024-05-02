import React from 'react';

// Components
import DefaultLayout from '../components/layouts/DefaultLayout';
import CustomersInfoBlock from 'components/commonBlocks/CustomersInfoBlock';
import SeoHeader from 'components/commonBlocks/SeoHeader';
import AboutUs from 'components/commonBlocks/AboutUs';

// Hoc
import checkAuth from 'hoc/checkAuth';

// Constants
import { commonNamespaces } from 'utils/constants';

const AboutUsPage = (props) => (
    <DefaultLayout {...props}>
        <SeoHeader titleKey={'aboutUs'} />
        <CustomersInfoBlock />
        <AboutUs />
    </DefaultLayout>
);

/* istanbul ignore next */
AboutUsPage.getInitialProps = async () => {
    const namespacesRequired = [...commonNamespaces, 'defaultLayout', 'aboutUs', 'homepage', 'faq'];
    return { namespacesRequired };
};

export default checkAuth(AboutUsPage);
