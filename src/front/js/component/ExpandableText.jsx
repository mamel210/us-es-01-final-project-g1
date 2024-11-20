import React, { useState } from 'react'
import Alert from 'react-bootstrap/Alert';
import Collapse from "react-bootstrap/Collapse";

export const ExpandableText = ({ text, maxLength }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpanded = () => setIsExpanded(!isExpanded);

    const truncatedText = `${text.slice(0, maxLength)}...`;

    return (
        <div>
            <p dangerouslySetInnerHTML={{ __html: isExpanded ? text : truncatedText }}></p>

            <Collapse in={isExpanded}>
                <div>
                    <p dangerouslySetInnerHTML={{ __html: text }}></p>
                </div>
            </Collapse>
            <Alert.Link href="#" onClick={toggleExpanded}>  {isExpanded ? "Less" : "More"}</Alert.Link>

        </div>
    );
};