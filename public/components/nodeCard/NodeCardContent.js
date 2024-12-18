import React from "react"

export default function NodeCardContent({
    node,
    isFlipped,
    isHovered,
    isEditing,
    currentTimelineIndex,
    nodeIDsTimelineLength,
    onInputChanged
}) {
    function getConditionalStyles(isVisible) {
        const opacityClass = isVisible ? "opacity-100" : "opacity-50";
        const scaleClass = isVisible ? "scale-x-[1]" : "scale-x-[-1]";
        const blurClass = isVisible ? "" : isHovered ? "blur-sm" : "blur-lg";
        return `${opacityClass} ${scaleClass} ${blurClass}`;
    }

    const formatContentWithNewlines = (content) => {
        return content.split('\n').map((line, index) => (
            <React.Fragment key={index}>
                {line}
                <br />
            </React.Fragment>
        ));
    };

    return (
        <div
            id="card-content"
            className="grid text-center text-md-lg p-7 pointer-events-none select-none"
        >
            <div
                id="front-side"
                className={`col-start-1 row-start-1 flex flex-col items-center justify-center transition-all ${getConditionalStyles(!isFlipped)}`}
            >
                {isEditing ? (
                    <div className="pointer-events-auto">
                        {node?.title && <input
                            name="title"
                            type="text"
                            className="w-full bg-clear p-1 text-white focus:outline-none focus:ring-0 focus:ring-grey-dark/50 rounded-md"
                            placeholder={node?.title || "Title"}
                            value={node?.title || ""}
                            onChange={(e) =>
                            {
                                onInputChanged(e);
                            }}
                        />}
                        <textarea
                            name="content"
                            className="w-full bg-clear p-1 text-white focus:outline-none focus:ring-0 focus:ring-grey-dark/50 rounded-md"
                            // rows="4"
                            placeholder={node?.content || "Content"}
                            value={node?.content || ""}
                            onChange={(e) => {
                                onInputChanged(e);
                            }}
                        />
                    </div>
                ) : (
                    <>
                        {node?.title && <h1>{node?.title}</h1>}
                        <p>{node?.content && formatContentWithNewlines(node.content)}</p>
                    </>
                )}
            </div>
            <div
                id="back-side"
                className={`col-start-1 row-start-1 ${getConditionalStyles(
                    isFlipped
                )}`}
            >
                <h1 className="mb-4 text-lg text-center">
                    Node [{currentTimelineIndex + 1} / {nodeIDsTimelineLength}]
                </h1>
                <p> - {node?.inspiration} </p>
                <br />
                <p className="absolute left-0 right-0 -bottom-1 text-base">
                    {(node?.frequency * 100).toFixed(2)}% Likely to appear
                </p>
            </div>
        </div>
    );
}
