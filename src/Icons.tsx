// Made in google drawings

function DownloadIcon({ className }: { className: string }) {
    return (
        <svg version="1.1" viewBox="0.0 0.0 100.0 100.0" fill="none" stroke="none" stroke-linecap="square" stroke-miterlimit="10" xmlns="http://www.w3.org/2000/svg" className={className}>
            <clipPath id="p.0">
                <path d="m0 0l100.0 0l0 100.0l-100.0 0l0 -100.0z" clip-rule="nonzero" />
            </clipPath>
            <g clip-path="url(#p.0)">
                <path fill="currentColor" d="m39.99344 0l20.031494 0l0 69.98425l-20.031494 0z" fill-rule="evenodd" />
                <path fill="currentColor" d="m25.0 69.961945l25.007874 20.031494l25.007874 -20.031494z" fill-rule="evenodd" />
                <path fill="currentColor" d="m0 89.99344l100.0 0l0 9.984253l-100.0 0z" fill-rule="evenodd" />
            </g>
        </svg>
    );
}

function UploadIcon({ className }: { className: string }) {
    return (
        <svg version="1.1" viewBox="0.0 0.0 100.0 100.0" fill="none" stroke="none" stroke-linecap="square" stroke-miterlimit="10" xmlns="http://www.w3.org/2000/svg" className={className}>
            <clipPath id="p.0">
                <path d="m0 0l100.0 0l0 100.0l-100.0 0l0 -100.0z" clip-rule="nonzero" />
            </clipPath>
            <g clip-path="url(#p.0)">
                <path fill="currentColor" d="m39.99344 20.031496l20.031494 0l0 60.0l-20.031494 0z" fill-rule="evenodd" />
                <path fill="currentColor" d="m75.01575 20.030184l-25.007874 -20.031496l-25.007874 20.031496z" fill-rule="evenodd" />
                <path fill="currentColor" d="m0.010498688 89.99344l100.0 0l0 9.984253l-100.0 0z" fill-rule="evenodd" />
            </g>
        </svg>
    );
}

export { DownloadIcon, UploadIcon };
