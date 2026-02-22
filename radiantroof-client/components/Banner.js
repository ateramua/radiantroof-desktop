import Image from 'next/image'


const Banner= ( {headerText}) => {
    return (
      <header className="row mb-4">
         <div className="col-5">
            <Image src="/ElevateEstate.png" alt ="logo" width={200} height={100} />
         </div>
         <div className="text-3xl font-bold text-center">
            {headerText}
         </div>
      </header>
 );

}

export default Banner;