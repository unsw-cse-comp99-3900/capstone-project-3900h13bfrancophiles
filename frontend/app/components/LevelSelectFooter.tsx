'use client';

import { Stack, Typography, Sheet } from "@mui/joy";
import * as React from 'react';

interface FooterItemProps {
    title: string;
    activeLevel: string;
    setActiveLevel: React.Dispatch<React.SetStateAction<string>>;
}

interface FooterProps {
    levelData: string[];
    activeLevel: string;
    setActiveLevel: React.Dispatch<React.SetStateAction<string>>;
}

function FooterItem({ title, activeLevel, setActiveLevel }: FooterItemProps) {
    return (<Stack
        sx={{
            background: activeLevel === title ? "lightgrey" : "inherit",
            alignContent: "center",
            width: '25vw',
            maxWidth: 200,
            height: "100%",
            textDecoration: "none",
            "&:hover": { bgcolor: "#D1E2F8", opacity: "40%" },
        }}
        onClick={() => setActiveLevel(title)}
    >
        <Typography
            level="h4"
            fontSize={14}
            margin="auto"
            px={5}
            sx={{ textAlign: "center" }}
        >
            {title}
        </Typography>
    </Stack>)
}

const LevelSelectFooter = ({ levelData, activeLevel, setActiveLevel }: FooterProps) => {
    const footerStyle = {
        borderTop: "3px solid grey",
        width: "100%",
        height: 60,
    };
    return (
        <Sheet sx={{...footerStyle, }}>
            <Stack direction="row" alignItems="center" height="100%">
                {levelData.map((title, index) => (
                    <FooterItem key={index} title={title} activeLevel={activeLevel} setActiveLevel={setActiveLevel} />
                ))}
            </Stack>
        </Sheet>
    )
};

export default LevelSelectFooter;