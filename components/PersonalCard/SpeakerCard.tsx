import Image from "next/image";

interface SpeakerProps {
  name: string;
  title: string;
  avatar: string;
}

const SpeakerCard: React.FC<SpeakerProps> = ({ name, title, avatar }) => {
  return (
    <div className="flex flex-col items-center text-center">
      <Image
        unoptimized
        src={avatar}
        alt=""
        width={100}
        height={0}
        className="h-auto mb-4"
      />
      <div className="text-lg">{name}</div>
      <div className="text-sm text-center" style={{ whiteSpace: "pre-wrap" }}>
        {title}
      </div>
    </div>
  );
};

export default SpeakerCard;
