import React, { useContext, useState } from "react"
import OverlayTrigger from "react-bootstrap/OverlayTrigger"
import Tooltip from "react-bootstrap/Tooltip"
import Button from "react-bootstrap/Button"
import { FaRegEye } from "react-icons/fa"
import { MdZoomIn, MdZoomOut } from "react-icons/md"
import { Context } from "../../store/appContext"
import { SkeletonTable } from "../../component/Loader.jsx"
import { CustomModal } from "../../component/CustomModal.jsx"
import { Filters } from "../../component/Filters.jsx"
import { Title } from "../../component/Title.jsx"
import { NoRecords } from "../../component/NoRecords.jsx"
import { Spinner } from "react-bootstrap"

export const Muscles = () => {
    const [filter, setFilter] = useState(null);
    const [viewMuscles, setViewMuscles] = useState({
        show: false,
        selectedMuscle: ""
    })
    const [zoom, setZoom] = useState(300)
    const [isMuscleImageLoaded, setIsMuscleImageLoaded] = useState(false);

    const { store } = useContext(Context)
    const { muscles, isAppLoading } = store

    const filteredMuscles = muscles.filter(muscle =>
        filter === null ? true : muscle.is_front === filter
    );
    const filterOptions = [
        { label: "Front", value: true },
        { label: "Back", value: false },
    ];

    const handleViewClick = (muscle) => {
        setViewMuscles({ selectedMuscle: muscle, show: true })
        setZoom(300);
    }

    const handleClose = () => {
        setViewMuscles({ selectedMuscle: "", show: false })
        setIsMuscleImageLoaded(false)
    }

    const handleZoomIn = () => {
        if (zoom < 900) setZoom(prevZoom => prevZoom + 100);
    };

    const handleZoomOut = () => {
        if (zoom > 200) setZoom(prevZoom => prevZoom - 100);
    };

    if (isAppLoading) {
        return (
            <div className={'container mt-5'}>
                <SkeletonTable />
            </div>
        )
    }

    return (
        <div className="container mt-2">
            <Title title={"Muscles"} />
            <Filters options={filterOptions} onFilterChange={setFilter} />
            <table className='table table-dark table-striped table-responsive'>
                <thead>
                    <tr>
                        <th scope='col'>Scients Name</th>
                        <th scope='col'>English Name Date</th>
                        <th scope='col'>is Front</th>
                        <th scope='col'></th>
                    </tr>
                </thead>
                <tbody>
                    {filteredMuscles.length ? muscles &&
                        filteredMuscles.map((muscle, index) => {
                            return (
                                <tr key={index}>
                                    <td>{muscle?.name}</td>
                                    <td>{muscle?.name_en}</td>
                                    <td>{muscle?.is_front ? "Is front muscle" : "is back muscle"}</td>
                                    <td>
                                        <Button size={"sm"} onClick={() => handleViewClick(muscle)} variant="info">
                                            <span className="d-flex gap-1 align-items-center">
                                                <FaRegEye /> Preview
                                            </span>
                                        </Button>
                                    </td>
                                </tr>
                            );
                        })
                        : <NoRecords message="No muscles to show" />}
                </tbody>
            </table>
            <CustomModal
                show={viewMuscles.show}
                onHide={handleClose}
                title={viewMuscles.selectedMuscle.name_en}
                size="lg"
            >
                <div className="d-flex justify-content-end gap-2" >
                    <OverlayTrigger overlay={<Tooltip id="tt-zoom-out">Zoom Out</Tooltip>}>
                        <div onClick={handleZoomOut} style={{ cursor: "pointer", userSelect: "none" }}>
                            <MdZoomOut size={"2rem"} fill={"var(--primary)"} />
                        </div>
                    </OverlayTrigger>
                    <OverlayTrigger overlay={<Tooltip id="tt-zoom-in">Zoom In</Tooltip>}>
                        <div onClick={handleZoomIn} style={{ cursor: "pointer", userSelect: "none" }}>
                            <MdZoomIn size={"2rem"} fill={"var(--primary)"} />
                        </div>
                    </OverlayTrigger>
                </div>
                <div className="d-flex justify-content-center">
                    {!isMuscleImageLoaded && <div style={{ width: "300px", height: "300px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Spinner animation="border" variant="warning" />
                    </div>}
                    <img
                        src={`${process.env.BACKEND_URL}${viewMuscles.selectedMuscle.image_url_main}`}
                        alt={viewMuscles.selectedMuscle.name_en}
                        className={`img-fluid ${isMuscleImageLoaded ? "" : "d-none"}`}
                        style={{ height: `${zoom}px`, width: `${zoom}px`, transition: "height 0.3s ease" }}
                        onLoad={() => setIsMuscleImageLoaded(true)}
                    />
                </div>
                <p className="mt-3">Scientific name: {viewMuscles.selectedMuscle.name || viewMuscles.selectedMuscle.name_en}</p>
            </CustomModal>


        </div>
    )
}