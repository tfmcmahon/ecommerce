import React from 'react'

function Footer() {
    return (
        <div className="footer">
            <a className='footerLink' href='mailto:tfmcmahon@gmail.com'>tfmcmahon@gmail.com</a>
            <ul className='socialList'>
                <li className='socialListItem'>
                    <a 
                        className='socialListLink' 
                        href='https://www.linkedin.com/in/tfmcmahon/'
                        rel='noopener noreferrer' 
                        target='_blank'
                    >
                        <i className="fab fa-linkedin"></i>
                    </a>
                </li>

                <li className='socialListItem'>
                    <a 
                        className='socialListLink' 
                        href='https://github.com/tfmcmahon'
                        rel='noopener noreferrer'
                        target='_blank'
                    >
                        <i className="fab fa-github-square"></i>
                    </a>
                </li>

                <li className='socialListItem'>
                    <a 
                        className='socialListLink' 
                        href='https://codepen.io/tfmcmahon'
                        rel='noopener noreferrer'
                        target='_blank'
                    >
                        <i className="fab fa-codepen"></i>
                    </a>
                </li>

                <li className='socialListItem'>
                    <a 
                        className='socialListLink'
                        href='https://glitch.com/@tfmcmahon'
                        rel='noopener noreferrer' 
                        target='_blank'
                    >
                        <i className="fas fa-fish"></i>
                    </a>
                </li>
            </ul>
        </div> 
    )
}

export default Footer