import React from 'react'

const Content = React.memo(({ paragraph, word, charIndex }) => {
    // console.log('render content');
    return (
        <div className="content">
            {
                paragraph.split('').map((char, index) => (
                    <span key={index} className={`
              char 
              ${index === charIndex ? 'active' : ''}
              ${word[index] === char
                            ? 'correct'
                            : index < charIndex ? 'incorrect' : ''
                        }
              `}>
                        {char}
                    </span>
                ))
            }
        </div>
    )
})

export default Content