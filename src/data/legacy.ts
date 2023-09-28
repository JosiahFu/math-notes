import { MathSegmentData, TextSegmentData } from './notes';
import { SerializedBlocks, SerializedDocument } from './serialize';

type SliceAfter<T extends unknown[], U extends T[number]> = T extends [
    infer First,
    ...infer Rest,
]
    ? First extends U
    ? Rest
    : SliceAfter<Rest, U>
    : never;

type LegacyFieldType = 'MATH' | 'TEXT';

// ===================

interface V1 {
    title: string;
    sections: { value: string; type: LegacyFieldType }[][];
}

interface V2 {
    title: string;
    sections: { value: string; type: LegacyFieldType; isAnswer: boolean }[][];
    version: 2;
}

interface V3 extends SerializedDocument { }

//  ==================

type Order = [V1, V2, V3];

type NewerThan<T extends Order[number]> = SliceAfter<Order, T>[number];

type ImportedData = Order[number];

function fixV1(data: ImportedData): asserts data is NewerThan<V1> {
    if (!('version' in data)) {
        (data as V2).sections.forEach(section =>
            section.forEach(block => (block.isAnswer = false))
        );
        (data as V2).version = 2;
    }
}

function fixV2(data: NewerThan<V1>): asserts data is NewerThan<V2> {
    if (data.version === 2) {
        (data as unknown as V3).blocks = data.sections
            .map(section =>
                section.map<SerializedBlocks[number]>((block, index) => ({
                    type: 'NOTE',
                    content:
                        block.type === 'MATH'
                            ? [
                                TextSegmentData(''),
                                MathSegmentData(block.value),
                                TextSegmentData(''),
                            ]
                            : [TextSegmentData(block.value)],
                    indent: index === 0 ? 0 : 1,
                    isAnswer: block.isAnswer,
                }))
            )
            .flat(1);
        delete (data as Partial<V2>).sections;
    }
}

/**
 * NOTE: Mutates data
 * @param data
 */
function dataFixerUpper(data: ImportedData): SerializedDocument {
    fixV1(data);
    fixV2(data);

    return data;
}

export { dataFixerUpper };
