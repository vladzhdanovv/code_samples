import React from 'react';
import { useTranslation } from 'i18n';
import Styles from './styles';

const CustomersInfoBlock = () => {
    const { t } = useTranslation('aboutUs');
    const generateItem = (index) => (
        <div className="item">
            <div className="item-tag">{t(`aboutUs:infoBlock.rightBlock.scope${index}.scope`)}</div>
            <div className="item-title-block">
                <div className="item-title">{t(`aboutUs:infoBlock.rightBlock.scope${index}.title`)}</div>
                <div className="total-count">{t(`aboutUs:infoBlock.rightBlock.scope${index}.count`)}</div>
            </div>
            <div className="item-content">
                <div className="item-content__text">{t(`aboutUs:infoBlock.rightBlock.scope${index}.text`)}</div>
                <div className="item-content__total">
                    <div className="total">
                        <div className="total-text">{t(`aboutUs:infoBlock.rightBlock.scope${index}.countText`)}</div>
                    </div>
                </div>
            </div>
        </div>
    );

    return(
        <Styles>
            <div className="block-wrapper">
                <div className="description">
                    <h2>
                        {t('aboutUs:infoBlock.leftBlock.title')}
                        <br/>
                        {t('aboutUs:infoBlock.leftBlock.subtitle')}
                    </h2>
                    <p className={'common-text'}>{t('aboutUs:infoBlock.leftBlock.text1')}</p>
                    <p className="common-text">
                        <span>{t('aboutUs:infoBlock.leftBlock.boldText')}</span>
                        {t('aboutUs:infoBlock.leftBlock.text2')}
                    </p>
                </div>
                <div className={'background'}>
                    <div className="scopes">
                        {generateItem(1)}
                        {generateItem(2)}
                        {generateItem(3)}
                    </div>
                </div>
            </div>
        </Styles>
    );
};

export default CustomersInfoBlock;