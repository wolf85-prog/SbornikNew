import { useMemo, useEffect, useState } from "react";
import {Platform} from "react-native";
import {Skia, Line, vec, useFonts, Paragraph, TextAlign, Circle, FontWeight, Glyphs, useFont} from "@shopify/react-native-skia";


// Example from https://shopify.github.io/react-native-skia/docs/shapes/path/
const Setka = ({data}) => {
    const [code, setCode] = useState([]);

    useEffect(() => {
          console.log("code: ", data)
          //console.log("lad: ", data.lad) 

        let array = (""+data).split("").map(Number)
        console.log(array);
        setCode(array)
    }, [data])

    useEffect(() => {
      console.log("code array: ", code);
    }, [code])

    const customFontMgr = useFonts({
        Poppins: [
          require("./../assets/fonts/Poppins-Bold.ttf")
        ],
        Noto: [require("./../assets/fonts/SpaceMono-Regular.ttf")],
    });
      

    const paragraph = useMemo(() => {
        // Are the font loaded already?
        if (!customFontMgr) {
            return null;
        }

        const paragraphStyle = {
          textAlign: TextAlign.Center
        };

        const textStyle = {
          color: Skia.Color("black"),
          //fontFamilies: ["Poppins"],
          fontSize: 22,
        };
        return Skia.ParagraphBuilder.Make(paragraphStyle, customFontMgr)
          .pushStyle({ ...textStyle, fontStyle: { weight: 700 } })
          .addText("E     A     D     G     H     E\n")
          .addText(code[0].toString() +"     "+ code[1].toString() +"     "+ code[2].toString() +"     "+ code[3].toString() +"     "+ code[4].toString() +"     "+ code[5].toString())
          .pop()
          .build();
    }, [customFontMgr]);

    const paragraph2 = useMemo(() => {
        // Are the font loaded already?
        if (!customFontMgr) {
            return null;
        }

        const paragraphStyle = {
          textAlign: TextAlign.Center
        };

        const textStyle = {
          color: Skia.Color("black"),
          //fontFamilies: ["Poppins"],
          fontSize: 32,
        };
        return Skia.ParagraphBuilder.Make(paragraphStyle, customFontMgr)
          .pushStyle({ ...textStyle, fontStyle: { weight: 500 } })
          .addText("   I\n   II\n   III\n   IV\n   V\n")
          .pop()
          .build();
    }, [customFontMgr]);


    //-----------------------------------------------------------------------

    const lineStart = 50;
    const lineEnd = 250;

    const horizontalCenter = 50;
    const horizontalCenter2 = 90;
    const horizontalCenter3 = 130;
    const horizontalCenter4 = 170;
    const horizontalCenter5 = 210;
    const horizontalCenter6 = 250;

    
    const lineStart2 = 50;
    const lineEnd2 = 250;

    const verticalCenter = 50;
    const verticalCenter2 = 90;
    const verticalCenter3 = 130;
    const verticalCenter4 = 170;
    const verticalCenter5 = 210;
    const verticalCenter6 = 250;

    const r = 10;

    return (
        <>
            <Paragraph paragraph={paragraph} x={0} y={0} width={300} />

            <Paragraph paragraph={paragraph2} x={-145} y={55} width={300} />
            

            {/* Горизонтальные линии */}
            <Line
                p1={vec(lineStart, verticalCenter)}
                p2={vec(lineEnd, verticalCenter)}
                strokeWidth={4}
                color={"black"}
            />

            <Line
                p1={vec(lineStart, verticalCenter2)}
                p2={vec(lineEnd, verticalCenter2)}
                strokeWidth={2}
                color={"black"}
            />

            <Line
                p1={vec(lineStart, verticalCenter3)}
                p2={vec(lineEnd, verticalCenter3)}
                strokeWidth={2}
                color={"black"}
            />

            <Line
                p1={vec(lineStart, verticalCenter4)}
                p2={vec(lineEnd, verticalCenter4)}
                strokeWidth={2}
                color={"black"}
            />

            <Line
                p1={vec(lineStart, verticalCenter5)}
                p2={vec(lineEnd, verticalCenter5)}
                strokeWidth={2}
                color={"black"}
            />

            <Line
                p1={vec(lineStart, verticalCenter6)}
                p2={vec(lineEnd, verticalCenter6)}
                strokeWidth={2}
                color={"black"}
            />

        {/* Вертикальные линии */}
            <Line
                p1={vec(horizontalCenter, lineStart2)}
                p2={vec(horizontalCenter, lineEnd2)}
                strokeWidth={2}
                color={"black"}
            />

            <Line
                p1={vec(horizontalCenter2, lineStart2)}
                p2={vec(horizontalCenter2, lineEnd2)}
                strokeWidth={2}
                color={"black"}
            />

            <Line
                p1={vec(horizontalCenter3, lineStart2)}
                p2={vec(horizontalCenter3, lineEnd2)}
                strokeWidth={2}
                color={"black"}
            />

            <Line
                p1={vec(horizontalCenter4, lineStart2)}
                p2={vec(horizontalCenter4, lineEnd2)}
                strokeWidth={2}
                color={"black"}
            />

            <Line
                p1={vec(horizontalCenter5, lineStart2)}
                p2={vec(horizontalCenter5, lineEnd2)}
                strokeWidth={2}
                color={"black"}
            />

            <Line
                p1={vec(horizontalCenter6, lineStart2)}
                p2={vec(horizontalCenter6, lineEnd2)}
                strokeWidth={2}
                color={"black"}
            />

            {/* струна 1 */}
            {   code[0] !== 0 ?
                <Circle cx={50} cy={30 + 40*code[0]} r={r} color="blue" />
                : ''
            }

            {/* струна 2 */}
            {   code[1] !== 0 ?
                <Circle cx={90} cy={30 + 40*code[1]} r={r} color="blue" />
                :''
            }
            
            {/* струна 3, лад 3 */}
            {   code[2] !== 0 ?
                <Circle cx={130} cy={30 + 40*code[2]} r={r} color="blue" />
                :''
            }
            
            {/* струна 4, лад 4 */}
            {   code[3] !== 0 ?
                <Circle cx={170} cy={30 + 40*code[3]} r={r} color="blue" />
                :''
            }

            {/* струна 5, лад 5 */}
            {   code[4] !== 0 ?
                <Circle cx={210} cy={30 + 40*code[4]} r={r} color="blue" />
                :''
            }

            {/* струна 6, лад 1 */}
            {   code[5] !== 0 ?
                <Circle cx={250} cy={30 + 40*code[5]} r={r} color="blue" />
                :''
            }
        </>
        
    );
};

export default Setka;