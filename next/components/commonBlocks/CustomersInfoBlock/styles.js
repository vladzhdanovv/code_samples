import styled from 'styled-components';
import { COLORS } from 'style/constants';

export default styled.div`
margin: 185px 0 161px;
 @media (max-width: 768px) {
     margin: 140px 0 0;
}
 .block-wrapper {
     .description {
         position:relative;
    }
     .description:after,.description:before{
         content:"";
         position:absolute;
         width:100%;
         -webkit-transform:skewY(-6deg);
         transform:skewY(-6deg);
         -webkit-transform-origin:100% 0;
         transform-origin:100% 0;
         @media (max-width: 670px) {
         
         -webkit-transform:skewY(-7deg);
         transform:skewY(-7deg);
         }
    }
     .description:before{
         z-index:-1;
         height:100%;
         background:var(--primary-color) no-repeat;
         background-size:100% 60px;
    }
     .description:after{
         height:124px;
         top:-124px;
         background:linear-gradient(${COLORS.MAIN._300},${COLORS.MAIN._300}),rgba(246,249,252,0);
         background-repeat:no-repeat;
         background-position:0 0,100% 0;
         background-size:20% 100%,80% 100%; 
    }
    
    @media (max-width: 960px) {
         .description *{
             margin: 0 32px;
             text-align: left;
        }
    }
     @media (max-width: 768px) {
         .description:after{
             height:70px;
             top:-70px;
             background:linear-gradient(${COLORS.MAIN._300},${COLORS.MAIN._300}),rgba(246,249,252,0);
             background-repeat:no-repeat;
             background-position:0 0,100% 0;
             background-size:60% 100%,70% 100%; 
        }
    }
     .description *{
         margin-right:88px;
         margin-left:116px;
         margin-bottom: 23px;
         color: #ffffff;
    }
     .description h2{
         padding-top:136px;  
         font-size: 40px;
         line-height: 48px;
         font-weight: 600;
         font-family: var(--title-font);        
         color: #FFFFFF;
         margin-bottom: 16px;
    }
     .common-text {
        letter-spacing: 0.2px;
        font-family: 'Space Grotesk', sans-serif;
        font-size: 15px;
        margin-bottom: 16px;
      }
     .common-text span {
         display: block;
         font-family: 'Space Grotesk Semi Bold', sans-serif;
         margin: 0 auto;
    }
     @media (max-width: 670px) {
         .description:before{
             top: -20px;
             height: 110%;
         }
         .description:after{
             top: -84px;
             height: 64px;
            }
         .description *{
             max-width:100%;
             margin: 0 32px;
             text-align: left;
        }
         .description h2{
             padding-top:70px;
             font: 600 20px/24px"Space Grotesk Semi Bold";             
                         
             margin-bottom:17px;
        }
         .common-text {
             font: 400 11px/16px "Space Grotesk";
             letter-spacing: normal;
             margin-bottom: 15px;
        }
    }
     
     .background{
         position: relative;
         display: flex;
         flex-direction: column;
         justify-content: flex-start;
    }     
     @media (max-width: 1160px) {
         .background:before{
             background: none;
        }
    }     
    @media (max-width: 1000px) {
        .description h2{
            margin-left: 40px;
            font: 600 22px/28px "Space Grotesk Semi Bold";
        }
         .common-text {
            margin-left: 40px;
            margin-right: 32px;
            line-height: 1.6;
        }
    }
    .scopes {
        display: flex;
        flex-direction: column;
        justify-content: center;
        height: 100%;        
        margin:0 24px 0;
        .item {
            margin-top: 30px;
            padding-top: 42px;
            border-top: 2px solid #f6f9fc;
            &:first-child {
                padding-top: 0;
                margin-top: 0;
                border-top: none;
            }
            &-tag {
                font: 500 15px/24px var(--title-font);
                color: var(--primary-color);
                letter-spacing: 0.2px;             
                margin-bottom: 3px;
                @supports ((width:-webkit-max-content) or (width:-moz-max-content) or (width:max-content)) {
                    position:relative;
                    width:-webkit-max-content;
                    width:-moz-max-content;
                    width:max-content;
                    &:before{
                        content:"";
                        position:absolute;
                        z-index:-1;
                        top:-4px;
                        left:-10px;
                        right:-10px;
                        -webkit-transform:skewY(-4deg);
                        transform:skewY(-4deg);
                        background-color: ${COLORS.MAIN._100};
                        height: 32px;
                    }
                }
            }            
            &-title {
                color: ${COLORS.SECONDARY._1000};
                font: 600 18px/32px var(--title-font);
            }
            .total-count {
                width: 152px;
                text-align: center;
                display:block;
                color: ${COLORS.SECONDARY._1000};
                font: 600 18px/32px var(--title-font);
                letter-spacing: 0.6px;
            }
            .item-title-block{
              display: flex;
              justify-content: space-between;
            }
            &-content {
                display: flex;
                align-items: center;
                &__text {
                    flex: 2;
                    color: #42526E;
                    font: 400 15px/24px var(--text-font-base);
                    letter-spacing: 0.2px;
                    padding-right: 24px;
                }
                &__total {
                    width: 152px;
                    flex-shrink: 0;
                    text-align: center;
                    .total {                        
                        &-text {
                            display:block;
                            color: #018642;
                            font: 15px/24px var(--text-font-base);
                        }
                    }
                }
            }
        }
        
    }

    @media (max-width: 670px) {
         .scopes{
            margin-top: 130px;
            .item-content__text{
                 color: #505F79;
                 font: 400 11px/18px "Space Grotesk";
            }
            .item-content__total .total-count {
                font: 600 15px/24px "Space Grotesk Semi Bold";
                letter-spacing: 0.2px;
            }
        }
    }
}
 @media (min-width:670px){
     .block-wrapper{
         display:grid;
         grid:auto/repeat(2,1fr);
    }
     .block-wrapper .common-SectionTitleHighlight{
         padding-top:120px 
    }
     .scopes{
         margin:2px 20px 0 
    }
     .scopes li{
         grid-gap:0 35px;
         gap:0 35px 
    }
}
 @media (max-width: 768px){
    .block-wrapper .scopes{
        padding-left: 0;
        margin-left: 24px;
        margin-right: 12px;
        .item{
            .total-count{
              width: 72px;          
            }
        }        
        .item-content__text{
           letter-spacing: normal;
           padding-right: 20px;
        }
        .item-content__total {
            width: 72px;
            margin-bottom: 55px;
            .total-text{
               font: 12px/16px var(--text-font-base);
               word-wrap: break-word;
            }
        }
    }
} 

@media (max-width: 320px){
  .block-wrapper .scopes{
      margin-left: 20px;
      .item{
        .item-title{
          font-size: 15px;
          line-height: 20px;
        }
      }
     .item-content__total {
            margin-bottom: 35px;
            }
  }
}
@media (max-width: 669px){
    .block-wrapper .scopes{
        display: block;
        max-width: 100%;
    }
} 
@media (max-width: 540px){
    .block-wrapper .scopes .item-content__text {
        padding-right: 12px;
    }
    .block-wrapper .scopes .item-content__total {
        width: 72px;
    }
    .block-wrapper .description{
        h2{
            padding-top:40px;
            text-align: center;
            font-size: 20px;
        }
    }
} 
`;
