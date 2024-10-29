"use client"
import { useState, useRef } from "react"
import { login, signup } from "@services/supabase-actions"
import { PageLayout } from "@ui/mui-layout"
import theme from "@utils/mui-theme"
import { 
  alpha,
  Box,
  Card,
  Dialog,
  FormControl,
  TextField,
  Button, 
  Divider,
  Typography,
  InputAdornment,
  IconButton
} from "@mui/material"
import { FlexBox } from "@app/components/ui/mui-elements"
import {
  Eye,
  EyeSlash, 
  NotePencil,
  SignIn,
  GoogleLogo, 
  Info,
  SpinnerGap
} from "@phosphor-icons/react/dist/ssr"
// import { createClient } from "@utils/supabase/client"


export default function LoginPage() {
  const [hasAccount, setHasAccount] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const userDataRef = useRef<FormData>(new FormData())
  const [isLoading, setIsLoading] = useState(false)
  
  const handleClickShowPassword = () => {
    setShowPassword((show) => !show)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    userDataRef.current.set(name, value)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>, isLogin: boolean) => {
    e.preventDefault()
    setIsLoading(true)
    if (isLogin) {
      await login(userDataRef.current)
      setIsLoading(false)
    } else {
      await signup(userDataRef.current)
      setIsLoading(false)
    }
  }

  // const supabase = createClient()
  // const redirectUrl = "https://ftofifkimfgrojwuylmy.supabase.co/auth/callback"

  const handleOAuthLogin = async () => {
    // (await supabase).auth.signInWithOAuth({
    //   provider: "google",
    //   options: {
    //     redirectTo: redirectUrl,
    //     queryParams: {
    //       access_type: "offline",
    //       prompt: "consent"
    //     }
    //   }
    // })
  }

  return (
    <PageLayout>
      <FlexBox sx={{
        flexDirection: "column",
        width: "94%", 
        maxWidth: "22rem",
        height: "100%",
        overflowY: "auto"
      }}>
        {hasAccount ? (
          <FormControl 
            key="login"
            component="form"
            onSubmit={(e) => handleSubmit(e, hasAccount)}
            sx={{ 
              width: "100%",
              marginTop: "auto",
              padding: "2rem", 
              animation: "fadeInFromLeft 240ms ease-out forwards"
            }}
          >
            <FlexBox sx={{ 
              flexDirection: "column", 
              gap: "2rem" 
            }}>
              <FlexBox sx={{
                flexDirection: "column",
                gap: "1rem",
                width: "100%",
              }}>
                <TextField 
                  variant="outlined"
                  label="Email"
                  name="email"
                  type="email"
                  onChange={handleInputChange}
                  required 
                  slotProps={{
                    inputLabel: {
                      shrink: true
                    }
                  }}
                  sx={{ 
                    width: "100%", 
                    "& .MuiInputBase-input": { 
                      padding: "0.875rem" 
                    } 
                  }}
                />
                <TextField 
                  variant="outlined"
                  label="Password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  onChange={handleInputChange}
                  required 
                  slotProps={{
                    inputLabel: {
                      shrink: true
                    },
                    input: {
                      endAdornment: 
                        <InputAdornment 
                          position="end" 
                          sx={{ cursor: "pointer" }}
                        >
                          <IconButton onClick={handleClickShowPassword}>
                            {showPassword 
                              ? <EyeSlash size={20} color={theme.palette.primary.light} /> 
                              : <Eye size={20} color={theme.palette.primary.light} />
                            }
                          </IconButton>
                        </InputAdornment>
                    }
                  }}
                  sx={{ 
                    width: "100%", 
                    marginBottom: "0.5rem",
                    "& .MuiInputBase-input": { 
                      padding: "0.875rem" 
                    } 
                  }}
                />
                <Button 
                  variant="outlined" 
                  type="submit"
                  disabled={isLoading}
                  sx={{ width: "100%", height: "2.5rem", gap: "0.5rem" }}
                >
                  <SignIn size={18} />
                  Log In
                </Button>
                <FlexBox sx={{ gap: "0.5rem" }}>
                  <Typography variant="body2">Don&apos;t have an account yet?</Typography>
                  <Button 
                    variant="text"
                    onClick={() => setHasAccount(false)}
                  >
                    Sign Up
                  </Button>
                </FlexBox>
              </FlexBox>
              <FlexBox sx={{
                flexDirection: "column",
                width: "100%",
                gap: "1rem"
              }}>
                <Divider orientation="horizontal" flexItem sx={{ marginBottom: "1rem" }} />
                <Button 
                  variant="contained" 
                  onClick={handleOAuthLogin}
                  disabled={isLoading}
                  sx={{ width: "100%", height: "2.5rem", gap: "0.25rem" }}
                >
                  <GoogleLogo size={20} weight="fill" />
                  Google
                </Button>
                <Typography variant="body2" sx={{ fontSize: "0.625rem" }}>An account will be created for new users</Typography>
              </FlexBox>
            </FlexBox>
          </FormControl>
        ) : (
          <FormControl 
            key="signup"
            component="form" 
            onSubmit={(e) => handleSubmit(e, hasAccount)}
            sx={{ 
              width: "100%",
              marginTop: "auto",
              padding: "2rem", 
              animation: "fadeInFromRight 240ms ease-out forwards"
            }}
          >
            <FlexBox sx={{ 
              flexDirection: "column", 
              gap: "2rem" 
            }}>
              <FlexBox sx={{
                flexDirection: "column",
                gap: "1rem",
                width: "100%",
              }}>
                <FlexBox sx={{
                  gap: "1rem"
                }}>
                  <TextField 
                    variant="outlined"
                    label="First Name"
                    type="text"
                    name="firstName"
                    onChange={handleInputChange}
                    required 
                    slotProps={{
                      inputLabel: {
                        shrink: true
                      }
                    }}
                    sx={{ 
                      width: "100%", 
                      "& .MuiInputBase-input": { 
                        padding: "0.875rem" 
                      } 
                    }}
                  />
                  <TextField 
                    variant="outlined"
                    label="Last Name"
                    type="text" 
                    name="lastName"
                    onChange={handleInputChange}
                    slotProps={{
                      inputLabel: {
                        shrink: true
                      }
                    }}
                    sx={{ 
                      width: "100%", 
                      "& .MuiInputBase-input": { 
                        padding: "0.875rem" 
                      } 
                    }}
                  />
                </FlexBox>
                <TextField 
                  variant="outlined"
                  label="Email"
                  name="email"
                  type="email"
                  onChange={handleInputChange}
                  required 
                  slotProps={{
                    inputLabel: {
                      shrink: true
                    }
                  }}
                  sx={{ 
                    width: "100%", 
                    "& .MuiInputBase-input": { 
                      padding: "0.875rem" 
                    } 
                  }}
                />
                <TextField 
                  variant="outlined"
                  label="Password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  onChange={handleInputChange}
                  required 
                  slotProps={{
                    inputLabel: {
                      shrink: true
                    },
                    input: {
                      endAdornment: 
                        <InputAdornment 
                          position="end" 
                          sx={{ cursor: "pointer" }}
                        >
                          <IconButton onClick={handleClickShowPassword}>
                            {showPassword 
                              ? <EyeSlash size={20} color={theme.palette.primary.light} /> 
                              : <Eye size={20} color={theme.palette.primary.light} />
                            }
                          </IconButton>
                        </InputAdornment>
                    }
                  }}
                  sx={{ 
                    width: "100%", 
                    marginBottom: "0.5rem",
                    "& .MuiInputBase-input": { 
                      padding: "0.875rem" 
                    } 
                  }}
                />
                <Button 
                  variant="outlined" 
                  type="submit"
                  disabled={isLoading}
                  sx={{ width: "100%", height: "2.5rem", gap: "0.5rem" }}
                >
                  <NotePencil size={18} />
                  Sign Up
                </Button>
                <FlexBox sx={{ gap: "0.5rem" }}>
                  <Typography variant="body2">Already have an account?</Typography>
                  <Button 
                    variant="text"
                    onClick={() => setHasAccount(true)}
                  >
                    Log In
                  </Button>
                </FlexBox>
              </FlexBox>
              <FlexBox sx={{
                flexDirection: "column",
                width: "100%",
                gap: "1rem"
              }}>
                <Divider orientation="horizontal" flexItem sx={{ marginBottom: "1rem" }} />
                <Button 
                  variant="contained" 
                  onClick={handleOAuthLogin}
                  disabled={isLoading}
                  sx={{ width: "100%", height: "2.5rem", gap: "0.25rem" }}
                >
                  <GoogleLogo size={20} weight="fill" />
                  Google
                </Button>
              </FlexBox>
            </FlexBox>
          </FormControl>
        )}

        <Card sx={{ 
          display: "flex",
          flexDirection: "column",
          alignItems: "start",
          gap: "0.5rem",
          width: "100%",
          margin: "auto 0 0.5rem",
          padding: "1rem",
          backgroundColor: alpha(theme.palette.primary.dark, 0.025),
          backdropFilter: "blur(20px)"
        }}>
          <Info size={24} color={theme.palette.primary.light} />
          <FlexBox sx={{
            alignItems: "start",
            justifyContent: "space-between",
            width: "100%"
          }}>
            <Box>
              <Typography color={theme.palette.primary.light}>What this does</Typography>
              <Typography variant="body2">Saves chats for later</Typography>
              <Typography variant="body2">Allows account mgmt</Typography>
            </Box>
            <Divider orientation="vertical" flexItem />
            <Box>
              <Typography color={theme.palette.primary.light}>What this doesn&apos;t do</Typography>
              <Typography variant="body2">Track your usage</Typography>
              <Typography variant="body2">Sell your data</Typography>
              <Typography variant="body2">Make you pancakes</Typography>
            </Box>
          </FlexBox>
        </Card>
      </FlexBox>

      <Dialog 
        open={isLoading} 
        sx={{ 
          "& .MuiPaper-root": {
            background: "transparent",
            "& > *": {
              animation: "spin 0.8s linear infinite"
            } 
          }
        }}
      >
        <SpinnerGap size={36} weight="bold" />
      </Dialog>
    </PageLayout>
  )
}
