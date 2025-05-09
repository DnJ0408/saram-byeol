import { ArrowLeft, ArrowRight } from '@phosphor-icons/react';
import React from 'react';
import { NavigateAction } from 'react-big-calendar';

interface Props {
  onNavigate: (action: 'NEXT' | 'PREV' | 'TODAY') => void;
  onPrefetch: (action: NavigateAction) => void;
}

const MoveMonthButton = ({ onNavigate, onPrefetch }: Props) => {
  return (
    <section className='mb-[17px] flex h-[40px] place-content-center items-center rounded-[8px] border border-gray-200'>
      <button
        onMouseEnter={() => onPrefetch('PREV')}
        onClick={() => onNavigate('PREV')}
        className='flex h-full items-center justify-center border-r border-gray-200 px-[12px] py-[10px]'
      >
        <ArrowLeft size={20} />
      </button>
      <button
        onMouseEnter={() => onPrefetch('NEXT')}
        onClick={() => onNavigate('NEXT')}
        className='flex h-full items-center justify-center border-r border-gray-200 px-[12px] py-[10px]'
      >
        <ArrowRight size={20} />
      </button>
      <button
        onClick={() => onNavigate('TODAY')}
        className='flex items-center justify-center px-[12px] py-[10px] text-[14px]'
      >
        오늘
      </button>
    </section>
  );
};

export default MoveMonthButton;
