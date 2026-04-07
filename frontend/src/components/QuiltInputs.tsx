import { useState, useId } from 'react';
import {
  COMMON_BLOCK_SIZES_IN,
  DEFAULT_SEAM_ALLOWANCE_IN,
  DEFAULT_UNIT,
  NUM_FABRICS_MIN,
  NUM_FABRICS_MAX,
} from '../constants';
import {
  getValidBlockSizes,
  calculateGridDimensions,
  calculateCutSize,
  isEvenlyDivisible,
} from '../quilting';

interface QuiltInputsProps {
  photo: File;
}

export function QuiltInputs({ photo }: QuiltInputsProps) {
  const [quiltWidth, setQuiltWidth] = useState<string>('');
  const [quiltHeight, setQuiltHeight] = useState<string>('');
  const [blockSize, setBlockSize] = useState<number | null>(null);
  const [numFabrics, setNumFabrics] = useState<string>('');
  const [seamAllowance, setSeamAllowance] = useState<string>(
    String(DEFAULT_SEAM_ALLOWANCE_IN)
  );

  const widthId = useId();
  const heightId = useId();
  const fabricsId = useId();
  const seamId = useId();

  const widthNum = parseFloat(quiltWidth);
  const heightNum = parseFloat(quiltHeight);
  const seamNum = parseFloat(seamAllowance);
  const fabricsNum = parseInt(numFabrics, 10);

  const dimensionsEntered =
    quiltWidth !== '' &&
    quiltHeight !== '' &&
    !isNaN(widthNum) &&
    !isNaN(heightNum) &&
    widthNum > 0 &&
    heightNum > 0;

  const validBlockSizes = dimensionsEntered
    ? getValidBlockSizes(widthNum, heightNum)
    : null;

  const noValidSizes = validBlockSizes !== null && validBlockSizes.length === 0;

  const displayBlockSizes: readonly number[] =
    validBlockSizes && validBlockSizes.length > 0
      ? validBlockSizes
      : COMMON_BLOCK_SIZES_IN;

  const blockSizeDividesEvenly =
    blockSize !== null &&
    dimensionsEntered &&
    isEvenlyDivisible(widthNum, blockSize) &&
    isEvenlyDivisible(heightNum, blockSize);

  const grid =
    blockSize !== null && blockSizeDividesEvenly
      ? calculateGridDimensions(widthNum, heightNum, blockSize)
      : null;

  const cutSize =
    blockSize !== null && !isNaN(seamNum) && seamNum >= 0
      ? calculateCutSize(blockSize, seamNum)
      : null;

  const fabricsValid =
    numFabrics !== '' &&
    !isNaN(fabricsNum) &&
    fabricsNum >= NUM_FABRICS_MIN &&
    fabricsNum <= NUM_FABRICS_MAX;

  const canContinue =
    dimensionsEntered && blockSizeDividesEvenly && fabricsValid && !isNaN(seamNum) && seamNum >= 0;

  function handleWidthChange(e: React.ChangeEvent<HTMLInputElement>) {
    setQuiltWidth(e.target.value);
    setBlockSize(null);
  }

  function handleHeightChange(e: React.ChangeEvent<HTMLInputElement>) {
    setQuiltHeight(e.target.value);
    setBlockSize(null);
  }

  function handleContinue() {
    // US-003 will wire this to the backend
    console.log('Quilt inputs complete', {
      photo,
      widthIn: widthNum,
      heightIn: heightNum,
      blockSizeIn: blockSize,
      numFabrics: fabricsNum,
      seamAllowanceIn: seamNum,
      unit: DEFAULT_UNIT,
    });
  }

  return (
    <div data-testid="quilt-inputs">
      <h1>Quiltix</h1>
      <p>Tell us about your quilt.</p>

      <section>
        <h2>Quilt Size</h2>

        <div>
          <label htmlFor={widthId}>Width ({DEFAULT_UNIT})</label>
          <input
            id={widthId}
            type="number"
            min="1"
            step="0.5"
            data-testid="quilt-width"
            value={quiltWidth}
            onChange={handleWidthChange}
          />
          <span aria-hidden="true">{DEFAULT_UNIT}</span>
        </div>

        <div>
          <label htmlFor={heightId}>Height ({DEFAULT_UNIT})</label>
          <input
            id={heightId}
            type="number"
            min="1"
            step="0.5"
            data-testid="quilt-height"
            value={quiltHeight}
            onChange={handleHeightChange}
          />
          <span aria-hidden="true">{DEFAULT_UNIT}</span>
        </div>
      </section>

      {dimensionsEntered && (
        <section>
          <h2>Block Size</h2>

          {noValidSizes && (
            <p data-testid="no-valid-sizes-warning" role="status">
              No standard block sizes divide evenly into {quiltWidth}" × {quiltHeight}". Any
              selection below will produce a non-integer grid — consider adjusting your quilt size.
            </p>
          )}

          <div data-testid="block-size-picker" role="group" aria-label="Block size">
            {displayBlockSizes.map((size) => {
              const isValid =
                isEvenlyDivisible(widthNum, size) && isEvenlyDivisible(heightNum, size);
              return (
                <label key={size} data-testid={`block-size-option-${size}`}>
                  <input
                    type="radio"
                    name="block-size"
                    value={size}
                    checked={blockSize === size}
                    onChange={() => setBlockSize(size)}
                  />
                  {size}"{!isValid && <span> ⚠</span>}
                </label>
              );
            })}
          </div>
        </section>
      )}

      {grid && (
        <p data-testid="grid-display">
          Your quilt will be {grid.columns} × {grid.rows} blocks
        </p>
      )}

      {cutSize !== null && blockSize !== null && (
        <p data-testid="cut-size-display">
          Cut size: {cutSize} {DEFAULT_UNIT} × {cutSize} {DEFAULT_UNIT}
        </p>
      )}

      <section>
        <h2>Fabrics &amp; Seam Allowance</h2>

        <div>
          <label htmlFor={fabricsId}>Number of fabrics</label>
          <input
            id={fabricsId}
            type="number"
            min={NUM_FABRICS_MIN}
            max={NUM_FABRICS_MAX}
            step="1"
            data-testid="num-fabrics"
            value={numFabrics}
            onChange={(e) => setNumFabrics(e.target.value)}
          />
          <span>({NUM_FABRICS_MIN}–{NUM_FABRICS_MAX})</span>
        </div>

        {numFabrics !== '' && !fabricsValid && (
          <p data-testid="fabrics-error" role="alert">
            Number of fabrics must be between {NUM_FABRICS_MIN} and {NUM_FABRICS_MAX}.
          </p>
        )}

        <div>
          <label htmlFor={seamId}>Seam allowance ({DEFAULT_UNIT})</label>
          <input
            id={seamId}
            type="number"
            min="0"
            step="0.125"
            data-testid="seam-allowance"
            value={seamAllowance}
            onChange={(e) => setSeamAllowance(e.target.value)}
          />
          <span aria-hidden="true">{DEFAULT_UNIT}</span>
        </div>
      </section>

      {canContinue && (
        <button data-testid="continue-button" onClick={handleContinue}>
          Continue
        </button>
      )}
    </div>
  );
}
