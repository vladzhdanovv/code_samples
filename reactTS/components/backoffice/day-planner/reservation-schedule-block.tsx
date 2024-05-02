import styled from "styled-components";
import * as React from "react";
import { ReservationSchedule } from "@/app/[locale]/backoffice/(root)/(private)/resource-schedule-planner/types";
import { Button, Popover } from "antd";
import { StarFilled } from "@ant-design/icons";
import { ReactNode } from "react";
import BlockCapacityIndicator from "@/components/backoffice/day-planner/block-capacity-indicator";

interface ReservationScheduleBlockProps {
  duration: number;
  topOffset: number;
  leftOffset: number;
  overlapCounter: number;
  reservationSchedule: ReservationSchedule,
  popoverContent: ReactNode,
  onPopoverOpenChange: (visible: boolean) => void,
  onDoubleClick: (reservationSchedule: ReservationSchedule) => void
}

const ReservationScheduleBlock = (props: ReservationScheduleBlockProps) => {
  return (
    <Popover content={props.popoverContent} onOpenChange={props.onPopoverOpenChange}>
      <$BlockContainer $duration={props.duration}
                       $topOffset={props.topOffset}
                       $leftOffset={props.leftOffset}
                       $overlapCounter={props.overlapCounter}
                       className="border flex cursor-pointer shadow-md"
                       onDoubleClick={() => props.onDoubleClick(props.reservationSchedule)}
      >
        <div style={{background: props.reservationSchedule.reservation.status.style.background, width: 16}}
             title={props.reservationSchedule.reservation.status.name}>
        </div>

        <div className="grow flex p-2">
          <div className="grow">
            {props.reservationSchedule.reservation.customer.full_name}
          </div>

          <div className="shrink-0">
            <div className="flex items-center gap-2">
              <BlockCapacityIndicator capacity={props.reservationSchedule.participants_quantity} capacityUsed={props.reservationSchedule.reservation.participants_count}/>
              {props.reservationSchedule.is_exclusive ? <Button type="primary"
                                                                icon={<StarFilled />}
                                                                size="small"
                                                                title={"Exclusive reservation"}
                                                                shape="circle" /> : null}
            </div>
          </div>
        </div>
      </$BlockContainer>
    </Popover>
  )
}

const $BlockContainer = styled.div<{ duration: number; topOffset: number; leftOffset: number; overlapCounter: number }>`
  position: absolute;
  left: calc(((100% - var(--block-capacity-zone-width)) / ${props => props.$overlapCounter}) * ${props => props.$leftOffset});
  width: calc((100% - var(--block-capacity-zone-width)) / ${props => props.$overlapCounter});
  top: calc(var(--minute-height) * ${props => props.$topOffset});
  height: calc(var(--minute-height) * ${props => props.$duration});
  background: ${props => props.$background || '#ffffff'};
  z-index: 1;
`;

export default ReservationScheduleBlock;
