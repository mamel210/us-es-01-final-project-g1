import React, { useContext, useState } from "react"
import OverlayTrigger from "react-bootstrap/OverlayTrigger"
import Tooltip from "react-bootstrap/Tooltip"
import Button from "react-bootstrap/Button"
import { FaRegEye } from "react-icons/fa";
import { MdZoomIn } from "react-icons/md";
import { MdZoomOut } from "react-icons/md";
import { Context } from '../../store/appContext.js'
import { Filters } from "../../component/Filters.jsx"
import { SkeletonTable } from "../../component/Loader.jsx"
import { CustomModal } from "../../component/CustomModal.jsx"
import { Title } from "../../component/Title.jsx";
import { ExpandableText } from "../../component/ExpandableText.jsx";
import { NoRecords } from "../../component/NoRecords.jsx";
import { Spinner } from "react-bootstrap";


export const Exercises = () => {
  const [filter, setFilter] = useState("");
  const [zoom, setZoom] = useState(300)
  const [viewMuscles, setViewMuscles] = useState({
    show: false,
    selectedMuscle: ""
  })
  const [viewExercise, setViewExercise] = useState({
    show: false,
    selectedExercise: ""
  })

  const [isMuscleImageLoaded, setIsMuscleImageLoaded] = useState(false);
  const [isExerciseImageLoaded, setIsExerciseImageLoaded] = useState(false);

  const { store } = useContext(Context)
  const { exercisesStates, isAppLoading } = store
  const { exercises } = exercisesStates

  const filteredExercises = exercises.filter(exe => filter ? exe.category_name === filter : true);

  const filterOptions = [
    { label: "Abs", value: "Abs" },
    { label: "Arms", value: "Arms" },
    { label: "Back", value: "Back" },
    { label: "Calves", value: "Calves" },
    { label: "Cardio", value: "Cardio" },
    { label: "Chest", value: "Chest" },
    { label: "Legs", value: "Legs" },
    { label: "Shoulders", value: "Shoulders" },
  ];

  const handleViewClick = (muscle) => {
    setViewMuscles({ selectedMuscle: muscle, show: true })
    setZoom(300);
  }

  const handleClose = () => {
    setViewMuscles({ selectedMuscle: "", show: false })
    setIsMuscleImageLoaded(false)
    setIsExerciseImageLoaded(false)
  }

  const openPreviewExercise = (exe) => setViewExercise({ selectedExercise: exe, show: true })
  const closePreviewExercise = () => setViewExercise({ selectedExercise: "", show: false })

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
    );
  }


  return (
    <div className={"container mt-2"}>
      <Title title={"Exercises"} />
      <Filters options={filterOptions} onFilterChange={setFilter} title={"Filter by Categories"} />
      <table className="table table-dark table-striped">
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Description</th>
            <th scope="col">Category</th>
            <th scope="col" className="text-center">Muscle</th>
            <th scope="col" className="text-center">Image</th>
          </tr>
        </thead>
        <tbody>
          {filteredExercises.length ? filteredExercises && filteredExercises.map((exercise) => {
            // {exercises && (Boolean(filter) ? filteredExercises : exercises).map((exercise) => {
            return (
              <tr key={exercise.id}>
                <td>{exercise.name}</td>
                <td style={{ maxWidth: "650px" }} >
                  <ExpandableText text={exercise.description} maxLength={100} />
                </td>
                <td>{exercise.category_name}</td>
                <td style={{ minWidth: "235px" }}>
                  <div className="d-flex gap-2 align-items-center justify-content-center">
                    <Button size={"sm"} onClick={() => handleViewClick(exercise)} variant={"info"}>
                      <span className="d-flex gap-1 align-items-center text-nowrap">
                        <FaRegEye /> {exercise.muscle_name_en || exercise.muscle_name}
                      </span>
                    </Button>
                  </div>
                </td>
                <td /* style={{ minWidth: "120px" }} */ >
                  <Button size={"sm"} onClick={() => openPreviewExercise(exercise)} variant={"info"}>
                    <span className="d-flex gap-1 align-items-center text-nowrap">
                      <FaRegEye />  Preview
                    </span>
                  </Button>
                </td>
              </tr>
            )
          }) : <NoRecords message="No Exercises to show" />}

        </tbody>
      </table>
      <CustomModal
        show={viewMuscles.show}
        onHide={handleClose}
        title={viewMuscles.selectedMuscle.muscle_name_en || viewMuscles.selectedMuscle.muscle_name}
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
            alt={viewMuscles.selectedMuscle.muscle_name_en}
            className={`img-fluid ${isMuscleImageLoaded ? "" : "d-none"}`}
            style={{ height: `${zoom}px`, width: `${zoom}px`, transition: "height 0.3s ease" }}
            onLoad={() => setIsMuscleImageLoaded(true)}
          />
        </div>
        <p className="mt-3">Scientific name: {viewMuscles.selectedMuscle.muscle_name || viewMuscles.selectedMuscle.muscle_name_en}</p>
      </CustomModal>

      <CustomModal
        show={viewExercise.show}
        onHide={closePreviewExercise}
        // title={viewMuscles.selectedMuscle.muscle_name_en}
        size="lg"
      >
        <h2 className="mt-3">Exercise name: {viewExercise.selectedExercise.name || viewExercise.selectedExercise.category_name}</h2>
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
          {!isExerciseImageLoaded && <div style={{ width: "300px", height: "300px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Spinner animation="border" variant="warning" />
          </div>}
          <img
            src={`${viewExercise.selectedExercise.image_url || "https://img.freepik.com/free-vector/flat-design-no-photo-sign_23-2149259323.jpg?t=st=1731464653~exp=1731468253~hmac=3e7898b220058168ebaca9ceb62e0e757e89031b2554e9ce0871ab5d33ead005&w=900"}`}
            alt={viewExercise.selectedExercise.name}
            className={`img-fluid ${isExerciseImageLoaded ? "" : "d-none"}`}
            style={{ height: `${zoom}px`, width: `${zoom}px`, transition: "height 0.3s ease" }}
            onLoad={() => setIsExerciseImageLoaded(true)}
          />
        </div>
      </CustomModal>
    </div>
  )
}

