import { Palette } from '@phosphor-icons/react';

interface Props {
  selectedColor: string;
  setSelectedColor: (color: string) => void;
}

const ColorOptions = ({ selectedColor, setSelectedColor }: Props) => {
  const colorOptions = ['#EB5757', '#F2994A', '#F2C94C', '#27AE60', '#2F80ED', '#56CCF2', '#9B51E0', '#F955EB'];

  return (
    <div className='flex items-center gap-8'>
      <section className='relative flex w-14 flex-shrink-0 flex-grow-0 flex-col items-center justify-center gap-1'>
        <Palette size={32} />
        <p className='min-w-max text-[14px]'>색상</p>
      </section>
      <section className='flex gap-2 w-full justify-evenly'>
        {colorOptions.map((color) => (
          <div
            key={color}
            onClick={() => setSelectedColor(color)}
            className={`h-6 w-6 rounded-full transition duration-200 ${selectedColor === color ? 'ring-2 ring-black ring-offset-2' : 'border-gray-300'} hover:scale-110 hover:ring-2 hover:ring-gray-400 hover:ring-offset-1`}
            style={{ backgroundColor: color }}
          />
        ))}
      </section>
    </div>
  );
};

export default ColorOptions;
