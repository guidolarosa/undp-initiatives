import { getActors } from "@/lib/sanity/queries";
import Image from "next/image";
import { urlForImage } from "@/lib/sanity/image";

const Footer = async () => {
  const actors = await getActors();
  const implementers = actors.filter((actor) =>
    actor.type.includes("implementer"),
  );
  const cofounders = actors.filter((actor) =>
    actor.type.includes("cofounder"),
  );

  return (
    <footer className="bg-footer w-full py-20 text-white">
      <div className="mx-auto max-w-270">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 grid-rows-2 gap-6 py-10 gap-y-30">
          <div className="col-span-1 border-t border-white pt-4 flex flex-col gap-4">
            <h2 className="text-2xl font-bold">IMPLEMENTED BY:</h2>
            <div className="gap-2 grid grid-cols-4">
              {implementers.map((implementer) => (
                <div key={implementer._id} className="relative h-30">
                  <Image
                    fill
                    src={urlForImage(implementer.image).url()}
                    alt={implementer.name}
                    className="object-contain"
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="col-span-1 border-t border-white pt-4 flex flex-col gap-4">
            <h2 className="text-2xl font-bold">CO-FOUNDED BY:</h2>
            <div className="gap-2 grid grid-cols-4">
              {cofounders.map((cofounder) => (
                <div key={cofounder._id} className="relative h-30">
                  <Image fill src={urlForImage(cofounder.image).url()} alt={cofounder.name} className="object-contain" />
                </div>
              ))}
            </div>
          </div>
          <div className="col-span-2 border-y py-4 ">
            <h2 className="text-2xl font-bold">CONTACT US AT</h2>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
