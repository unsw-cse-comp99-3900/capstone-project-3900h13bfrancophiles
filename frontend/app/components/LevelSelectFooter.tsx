'use client';

import { Box, Stack, Typography, Button, Sheet } from "@mui/joy";
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
            width: 200,
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
        position: "fixed",
        left: 0,
        bottom: 0,
        borderTop: "3px solid grey",
        width: "100%",
        height: 60,
        padding: 0,
        marginTop: 0
    };
    return (
        <Sheet sx={{...footerStyle, "display": {xs: 'none', sm: 'flex', borderTop: "3px solid grey"}}}>
            <Stack direction="row" alignItems="center" height="100%">
                {levelData.map((title, index) => (
                    <FooterItem key={index} title={title} activeLevel={activeLevel} setActiveLevel={setActiveLevel} />
                ))}
            </Stack>
        </Sheet>
    )
};

export default LevelSelectFooter;