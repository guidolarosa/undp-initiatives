interface Experience {
  _key: string;
  content: string;
  author: string;
  role: string;
}

interface ExperiencesProps {
  title: string;
  content: string;
  experiences: Experience[];
}

export const Experiences = ({
  title,
  content,
  experiences,
}: ExperiencesProps) => {
  console.log(experiences);
  return (
    <div className="w-284 mx-auto py-12">
      <div className="flex gap-4">
        <h2 className="text-[56px] font-semibold leading-18 tracking-[-0.02em] w-6/12">
          {title}
        </h2>
        <p className="text-[20px] text-foreground/80 whitespace-pre-line w-6/12">
          {content}
        </p>
      </div>
      <div className="flex gap-4 mt-12">
        {experiences.map((experience) => (
          <div
            key={experience._key}
            className="flex flex-col justify-between max-w-72.5 bg-theme-green p-6 rounded-2xl relative h-92.5"
          >
            <span className="text-8xl absolute">{`“`}</span>
            <p className=" whitespace-pre-line text-foreground/80 mt-14">
              {experience.content}
            </p>
            <div className="flex flex-col gap-2">
              <strong className="font-semibold">
                {experience.author}
                {experience.role && `, ${experience.role}`}
              </strong>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
