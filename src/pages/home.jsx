import React from 'react'
import {FaArrowRight} from "react-icons"
import {Link} from "react-router-dom"
import {HighLightText} from "../components/core/HomePage/HighLightText"
import {Button} from "../components/core/Button"
import Banner from "../assets/Images/Baner.mp4" 


const Home = () =>{
    return(
        <div>
            {/* Section 1 */}

            <div className='relative mx-auto flex flex-col w-11/12 max-w-maxContent items-center
                             text-white justify-between'>
                <Link to={"/signup"}>
                    <div className="group mt-16 p-1 mx-auto rounded-full bg-richblack-800 font-bold text-richblack-200 
                    transition-all duration-200 hover:scale-95 w-fit">
                        <div className ="flex flex-row items-center gap-2 rounded-full px-10 py-[5px]
                        transition-all duration-200 group-hover:bg-richblack-900">
                            <p>Become an Instructor</p>
                            <FaArrowRight/>
                        </div>
                    </div>
                </Link>

                <div className="text-center text-4xl font-semibold mt-7">
                    Empower Your Future with 
                    <HighLightText text={"Coding Skills"}/>
                </div>

                <div className="w-[90w] mt-4 text-center text-lg font-bold text-richblack-300 ">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </div>

                <div className="mt-8 flex flex-row gap-7">
                    <Button active={true} linkto={"/signup"}>
                        Learn more
                    </Button>

                    <Button active={false} linkto={"/signup"}>
                        Book A Demo
                    </Button>

                </div>

                
                <div className="shadow-blue-200">
                        <video
                        muted
                        loop
                        autoplay>
                            <source src={Banner} type="video/mp4"></source>
                        </video>
                    </div>

                    {/* Code Section 1 */}

                    <div className="">
                        <CodeBlocks/>
                    </div>

            </div>



            {/* Section 2 */}

            {/* Section 3 */}

            {/* Footer*/}
        </div>
    )
}