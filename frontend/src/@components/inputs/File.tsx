import styles from './File.module.scss';
import {useState} from 'react';

interface Props {
    savedImages?: string[],
    error?: string,
    onRemoveSavedImage?: (url: string) => void;
    uploadLabel?: string,
    callback?: (blob: any[]) => void;
    loading?: boolean,
}

const File = ({callback, uploadLabel, savedImages, onRemoveSavedImage, loading, error}: Props) => {

    const randomid = (): string => {
        const id = Math.random().toString(36).substring(7);
        return id;
    };
    
    const generateid = (times: number = 2): string => {
        const id = Array.from({length: times}, () => randomid()).join("");
        return id
    };

    const [preview, setPreview] = useState<string[]>([]);

    const [imagesData, setImagesData] = useState<string[]>([])

    const onChangeFile = async (e: any): Promise<void> => {
        e.preventDefault();
        const file = e.target.files ? e.target.files : e.dataTransfer.files;

        for(let i = 0; i < file.length; i++) {
            const objectUrl = URL.createObjectURL(file[i]);
            setPreview(preview => [...preview, objectUrl]);
            setImagesData(state => ([...state, file[i]]));
        };
    };

    const onRemoveFile = (index: number): void => {
        const clonePreview = [...preview];
        clonePreview.splice(index, 1);
        setPreview(clonePreview);
    };

    const onCallback = () => {
        setPreview([]);
        setImagesData([]);
        if(callback) callback(imagesData);
    };

    return (
        <div className={styles.container}>

            {loading && 
                <div className={styles.loading}>
                    <div className={styles.spinner} />
                </div>
            }

            {error && 
                <div className={styles.error}>
                    <p>{error}</p>
                </div>
            }

            <div className={styles.upload} onDragOver={(e) => e.preventDefault()} onDrop={onChangeFile}>
                <label htmlFor="myfile">Upload images <br/> or <br/> drag and drop</label>
                <input type="file" id="myfile" accept='image/*' className={styles.inputFile} onChange={onChangeFile}/>
            </div>

            <div className={styles.imageArea}>
                <div className={styles.saved}>
                    <p>Saved</p>
                    <div className={styles.map}>
                    {savedImages?.map((img, index) => 
                        <button type="button" key={index} onClick={() => onRemoveSavedImage && onRemoveSavedImage(img)}>
                            <img src={img} alt="preview"/>
                        </button> 
                    )}
                    </div>
                </div>
                <div className={styles.preview}>
                    <p>Preview</p>
                    <div className={styles.map}>
                    {preview.map((img, index) => 
                        <button type="button" key={generateid(3)} onClick={() => onRemoveFile(index)}>
                            <img src={img} alt="preview"/>
                        </button> 
                    )}
                    </div>
                </div>
            </div>
            

            {callback && !!imagesData.length &&
            <div className={styles.uploadBtn}>
                <button type="button" onClick={onCallback}>
                    { uploadLabel || "Upload"}
                </button>
            </div>
            }

        </div>
    )
}

export default File