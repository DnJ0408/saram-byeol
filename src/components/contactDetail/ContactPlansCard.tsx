import { PencilSimple, Trash } from '@phosphor-icons/react';
import { differenceInCalendarDays, format } from 'date-fns';
import { ko } from 'date-fns/locale';

interface ContactPlansCardProps {
  title: string;
  startDate: string;
  onEdit?: () => void;
  onDelete?: () => void;
  color?: string;
}

const ContactPlansCard= ({ title, startDate, onEdit, onDelete, color = '#ec4899' }: ContactPlansCardProps) => {
  const today = new Date();
  const start = new Date(startDate);
  const dDay = differenceInCalendarDays(start, today);
  const monthDay = format(start, 'M월 d일', { locale: ko });

  return (
    <div
      className='relative flex flex-col gap-2 rounded-lg border border-gray-100 bg-white p-4 shadow-md'
      style={{ boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)' }}
    >
      {/* 왼쪽 라인 */}
      <div className='absolute left-0 top-0 h-full w-1 rounded-l-md' style={{ backgroundColor: color }} />

      {/* 날짜 & 수정 버튼 라인 */}
      <div className='flex items-center justify-between'>
        <p className='text-sm font-semibold text-gray-700'>{monthDay}</p>
        <div className='flex gap-1'>
          {onEdit && (
            <button onClick={onEdit} className='text-gray-700 hover:text-blue-500'>
              <PencilSimple size={16} />
            </button>
          )}
          {onDelete && (
            <button onClick={onDelete} className='text-red-400 hover:text-red-500'>
              <Trash size={16} />
            </button>
          )}
        </div>
      </div>

      {/* D-day & 제목 */}
      <div className='flex flex-col'>
        <p className='text-lg font-bold text-black'>
          {dDay === 0 ? 'D-Day' : dDay > 0 ? `D-${dDay}` : `D+${Math.abs(dDay)}`}
        </p>
        <p className='text-base text-gray-800'>{title}</p>
      </div>
    </div>
  );
};

export default ContactPlansCard;
