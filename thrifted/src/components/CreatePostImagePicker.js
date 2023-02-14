import React, { useEffect } from "react";
import $ from "jquery";
import { useState } from "react";

function CreatePostImagePicker({
  setImage,
  setFeatureimg,
  title = "Add Photos",
}) {
  const [files, setFiles] = useState([]);
  const [mainImageIndex, setMainImageIndex] = useState(null);
  const [filesIndexes, setFilesIndexes] = useState([]);
  const [isApplied, setIsApplied] = useState(false);

  function convertImageToFileUrl(index) {
    if (!files.length) return "";
    if (index === null) return "";
    return URL.createObjectURL(files[index]);
  }

  useEffect(() => {
    if (files.length) {
      setImage(files[mainImageIndex]);
      var filter_files = [...files];
      filter_files.splice(mainImageIndex, 1);
      setFeatureimg(filter_files);
    }
  }, [mainImageIndex]);

  function parseImages(e) {
    setFiles(e.target.files);
    setFilesIndexes(Array.from(Array(e.target.files.length).keys()));
    setMainImageIndex(0);
    $(".open-createPostModal").click();
  }

  function cancelEverything() {
    setImage("");
    setFeatureimg([]);
    setFiles([]);
    setMainImageIndex(null);
    setFilesIndexes([]);
  }

  function applyEverything() {
    setIsApplied(true);
    $(".old-edit-post-img").remove();
  }

  return (
    <>
      <div className="form-group">
        {!isApplied ? (
          <>
            <input
              type="file"
              name="feature"
              id="feature_images"
              className="d-none"
              onChange={(e) => parseImages(e)}
              multiple
            />
            <div className="card">
              <div className="create-post-image-picker">
                <label className="create-post-choose-btn" for="feature_images">
                  <i className="fa fa-camera-retro mr-2"></i> {title}
                </label>
              </div>
            </div>
            
            <button
              type="button"
              class="btn btn-primary open-createPostModal d-none"
              data-toggle="modal"
              data-target="#createPostModal"
            >
              Launch
            </button>
            <div
              class="modal fade"
              id="createPostModal"
              tabindex="-1"
              role="dialog"
              aria-labelledby="exampleModalLabel"
              aria-hidden="true"
            >
              <div
                class="modal-dialog modal-dialog-centered modal-lg"
                role="document"
              >
                <div class="modal-content">
                  <div class="modal-body">
                    <div className="row">
                      <div className="col-md-4">
                        <small className="text-muted font-weight-bold">
                          Select a Cover Image
                        </small>
                        <div className="d-flex flex-wrap mt-2">
                          {filesIndexes.map((f, index) => {
                            return (
                              <div
                                className="create-post-modal-snap-img mr-2 mb-2"
                                key={index}
                                onClick={() => setMainImageIndex(index)}
                              >
                                <img
                                  src={convertImageToFileUrl(index)}
                                  className="firstimg img-fluid"
                                />
                                {index === mainImageIndex && (
                                  <i className="fa fa-check-circle text-success bg-light"></i>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      <div className="col-md-8">
                        <div className="create-post-modal-main-img">
                          <img
                            src={convertImageToFileUrl(mainImageIndex)}
                            className="firstimg img-fluid"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="modal-footer">
                    <button
                      type="button"
                      class="btn btn-secondary btn-modal-cancel"
                      data-dismiss="modal"
                      onClick={() => cancelEverything()}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      data-dismiss="modal"
                      onClick={() => applyEverything()}
                      class="btn btn-primary"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="row">
            <div className="col-md-4 post-main-img">
              <div className="main-image-wrapper">
                <img
                  src={convertImageToFileUrl(mainImageIndex)}
                  className="firstimg img-fluid"
                />
              </div>
            </div>
            <div className="col-md-8 post-feature-img">
              <div className="row">
                {filesIndexes.map((f, index) => {
                  return (
                    index !== mainImageIndex && (
                      <div className="col-md-3 col-sm-6" key={index}>
                        <div className="card">
                          <div className="card-body featurewrapper d-flex justify-content-center align-items-center">
                            <img
                              src={convertImageToFileUrl(index)}
                              className="featureimg img-fluid"
                            />
                          </div>
                        </div>
                      </div>
                    )
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default CreatePostImagePicker;
