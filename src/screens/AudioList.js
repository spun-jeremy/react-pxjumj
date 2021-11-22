import React, { useState, useEffect } from 'react';
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faAws } from "@fortawesome/free-brands-svg-icons";
// import {
//   faPlayCircle, faStopCircle,
//   faTrash, faPlay, faStop, faCircleNotch, faTimesCircle, faMinusCircle, faExternalLink, faUser, faUserAlt,
//   faTrashAlt, faUserHeadset, faWaveform, faWaveformPath, faDownload, faFileDownload, faTrafficLight,
//   faTrafficLightGo, faTrafficLightSlow, faTrafficLightStop, faBackward, faFilePlus
// } from "@fortawesome/pro-light-svg-icons";
// import { DateTime } from "luxon";

const apiServerURL =
  window.document.location.hostname === 'localhost'
    ? 'http://localhost:8004/api/'
    : '/api/';

export const AudioList = (_) => <div>Hello Hello</div>;

export const xxxAudioList = (_props) => {
  return <div>Hello again</div>;

  const [recordingsList, setRecordingsList] = useState([]),
    [waveformColour, setWaveformColour] = useState('grey'),
    [borderColour, setBorderColour] = useState('lightGreen'),
    [backgroundColour, setBackgroundColour] = useState('lightGreen'),
    [playingSample, setPlayingSample] = useState(),
    [showColourChooser, setShowColourChooser] = useState(false),
    s3URL = (key) =>
      `https://s3.console.aws.amazon.com/s3/object/` +
      `speakunique-always?region=eu-west-2&prefix=${key}`,
    colours = [
      'grey',
      'lightGreen',
      'recordRed',
      'lightPink',
      'brightBlue',
      'lightBlue',
      'lightGreen',
      'beige',
      'white',
      'black',
      'orange',
      'yellow',
      'lightLilac',
    ],
    playAudio = async (sampleId) => {
      const audId = `audioP`,
        existing = document.getElementById(audId);

      if (existing) {
        existing.remove();
        const ps = playingSample;
        setPlayingSample(null);
        if (ps === sampleId) return;
      }

      const audio = document.createElement('audio');
      audio.style.display = 'none';
      audio.id = audId;
      audio.src = `${apiServerURL}audio/listen/${escape(sampleId)}.wav`;
      audio.autoplay = true;
      audio.onended = () => {
        audio.remove();
        setPlayingSample(null);
      };
      document.body.appendChild(audio);
      setPlayingSample(sampleId);
    };

  // useEffect(() => {
  //   return;
  //   fetch(`${apiServerURL}audio/list`).then(response =>
  //     response.ok ? response.json() : {}
  //   ).then(data => {
  //     setRecordingsList(data.samples);
  //   });
  // }, []);
  // }, [playingSample, showColourChooser]);

  const statusToIcon = {
    GREEN: faTrafficLightGo,
    YELLOW: faTrafficLightSlow,
    RED: faTrafficLightStop,
    _: faTrafficLight,
  };

  const recordingLine = (r, idx) => (
    <div id={`line${idx}`}>
      <div className="columns">
        <div
          className="column is-narrow"
          style={{ paddingLeft: 20 }}
          onClick={() => window.open(s3URL(r.s3Key))}
        >
          <div
            onClick={() => window.open(s3URL(r.s3Key))}
            className="is-family-monospace"
          >
            <FontAwesomeIcon
              icon={faWaveformPath}
              size="1x"
              style={{ color: 'grey' }}
            />{' '}
            {r.id.substring(0, 4)}{' '}
            <FontAwesomeIcon size="1x" style={{ color: 'grey' }} icon={faAws} />{' '}
            <FontAwesomeIcon
              size="1x"
              style={{ color: 'grey' }}
              icon={faExternalLink}
            />
          </div>
          by {r.userId}
        </div>
        <div className="column is-narrow" style={{ marginTop: 5 }}>
          <FontAwesomeIcon
            size="2x"
            title={r.status}
            icon={statusToIcon[r.status] || statusToIcon._}
            style={{ padding: 2, margin: 2, marginLeft: 8 }}
          />
        </div>
        <div
          className="column is-2 is-family-monospace has-text-weight-light"
          style={{ fontSize: 'small' }}
        >
          {DateTime.fromISO(r.created).toLocaleString(DateTime.DATETIME_MED)}
          <br />
          <FontAwesomeIcon
            icon={faDownload}
            size="1x"
            onClick={(e) => {
              e.preventDefault();
              window.open(`${apiServerURL}audio/download/${r.id}`);
            }}
          />{' '}
          {r.bytes > 1024 * 1000
            ? (Math.round((r.bytes / 1024 / 1000) * 10) / 10).toLocaleString() +
              'mb'
            : Math.floor(r.bytes / 1024).toLocaleString() + 'kb'}
        </div>
        <div
          className="column is-1 has-text-right is-narrow"
          style={{ marginTop: 1 }}
        >
          <FontAwesomeIcon
            icon={playingSample && playingSample === r.id ? faStop : faPlay}
            size="2x"
            // style={{ color: waveformColour, opacity: 0.8 }}
            style={{ color: 'grey' }}
            onClick={(e) => {
              e.preventDefault();
              playAudio(r.id);
            }}
          />
        </div>
        <div className="column has-text-right" style={{ minWidth: 600 }}>
          <div className="columns is-gapless">
            <div className="column">
              <img
                src={`${
                  window.document.location.hostname === 'localhost'
                    ? 'http://deck.still.speakunique.io/api/'
                    : apiServerURL
                }wavpng/${r.id}-${
                  r.s3KeyHash
                }.png?width=580&height=40&colour=${escape(
                  waveformColour
                )}&border=${escape(borderColour)}&background=${escape(
                  backgroundColour
                )}`}
              />
            </div>
            <div className="column is-narrow is-family-monospace">
              &nbsp;
              {Math.floor(r.milliseconds / 100) / 10}s
            </div>
          </div>
        </div>
        <div className="column is-1 has-text-right" style={{ marginTop: 3 }}>
          <FontAwesomeIcon
            icon={faTrashAlt}
            size="2x"
            onClick={(e) => {
              e.preventDefault();
              if (window.confirm(`Delete this audio file?`))
                fetch(`${apiServerURL}audio/delete/${r.id}`)
                  .then((response) => response.json())
                  .then((_data) => {
                    document
                      .getElementById(`line${idx}`)
                      .classList.add('is-hidden');
                  });
              return false;
            }}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="columns">
      <div className="column is-1"></div>
      <div className="column">
        <div style={{ maxWidth: 1600 }}>
          <form>
            <h2
              className="title is-2 has-text-right is-family-monospace"
              style={{
                minHeight: 70,
                color: 'grey',
              }}
            >
              {/* I Will Always Be Me */}
            </h2>
            <div className="columns">
              <div className="column is-narrow" style={{ paddingLeft: 20 }}>
                <h4 className="title is-4 is-family-monospace">
                  {/* <FontAwesomeIcon icon={faBackward} /> */}
                  Books
                </h4>
              </div>
              <div className="column has-text-right">
                <a
                  href="/xadmin/audio/upload"
                  title="Upload an audio WAVE file into Books"
                >
                  <FontAwesomeIcon
                    icon={faFilePlus}
                    style={{ color: '#222' }}
                    size="2x"
                  />
                </a>
              </div>
              {/* <div className="column is-1"></div> */}
            </div>
            <div
              id="recordingsListDiv"
              style={{ minHeight: 450, maxHeight: 450, overflow: 'scroll' }}
            >
              {recordingsList && recordingsList.length ? (
                recordingsList.map(recordingLine)
              ) : (
                <div>
                  Book readings uploaded to the system will appear here.
                </div>
              )}
            </div>
            <div className="columns" style={{ marginTopL: 7 }}>
              <div className="column is-narrow" style={{ paddingLeft: 20 }}>
                <FontAwesomeIcon
                  icon={showColourChooser ? faTimesCircle : faMinusCircle}
                  style={{ color: 'grey' }}
                  onClick={() => setShowColourChooser(!showColourChooser)}
                />
              </div>
              {showColourChooser ? (
                <div
                  className="column is-family-monospace"
                  style={{ fontSize: '8pt' }}
                >
                  Waveform colour:{' '}
                  <select
                    onChange={(e) => {
                      setWaveformColour(e.target.value);
                    }}
                    class="is-family-monospace"
                    style={{ fontSize: '8pt' }}
                  >
                    {colours.map((col) => (
                      <option value={col} selected={col === waveformColour}>
                        {col}
                      </option>
                    ))}
                  </select>{' '}
                  Border:{' '}
                  <select
                    onChange={(e) => {
                      setBorderColour(e.target.value);
                    }}
                    class="is-family-monospace"
                    style={{ fontSize: '8pt' }}
                  >
                    {colours.map((col) => (
                      <option value={col} selected={col === borderColour}>
                        {col}
                      </option>
                    ))}
                  </select>{' '}
                  Background:{' '}
                  <select
                    onChange={(e) => {
                      setBackgroundColour(e.target.value);
                    }}
                    class="is-family-monospace"
                    style={{ fontSize: '8pt' }}
                  >
                    {colours.map((col) => (
                      <option value={col} selected={col === backgroundColour}>
                        {col}
                      </option>
                    ))}
                  </select>
                </div>
              ) : null}
              <div className="column has-text-right is-family-monospace">
                <a
                  className="is-underlined"
                  href="/xadmin/audio/"
                  style={{ color: 'grey' }}
                >
                  Books
                </a>{' '}
                |{' '}
                <a
                  href="#"
                  onClick={() => {
                    return false;
                  }}
                  style={{ color: 'grey' }}
                >
                  Stories
                </a>{' '}
                |{' '}
                <a
                  href="#"
                  onClick={() => {
                    return false;
                  }}
                  style={{ color: 'grey' }}
                >
                  Voices
                </a>{' '}
                |{' '}
                <a
                  href="#"
                  onClick={() => {
                    return false;
                  }}
                  style={{ color: 'grey' }}
                >
                  People
                </a>{' '}
                <a
                  href="https://www.speakunique.co.uk/"
                  style={{ color: 'grey', marginLeft: 2 }}
                  target="_blank"
                  rel="noopener, noreferer"
                >
                  SpeakUnique {new Date().getFullYear()}
                </a>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div className="column is-1"></div>
    </div>
  );
};
