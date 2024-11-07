"use client"
import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { useSnackbar } from "@hooks/global"
import { useThreads } from "@hooks/chat"
import { User } from "@types"
import { 
  logIn, 
  signUp
} from "@services/supabase-actions"
import { PageLayout } from "@ui/mui-layout"
import theme from "@utils/mui-theme"
import { 
  alpha,
  Box,
  Card,
  FormControl,
  TextField,
  Button, 
  Divider,
  Typography,
  InputAdornment,
  IconButton
} from "@mui/material"
import { 
  FlexBox, 
  LoadingDialog 
} from "@app/components/ui/mui-elements"
import {
  Eye,
  EyeSlash, 
  NotePencil,
  SignIn,
  GoogleLogo, 
  Info
} from "@phosphor-icons/react/dist/ssr"
// import { createClient } from "@utils/supabase/client"

type UserInputData = Omit<User, "id" | "created" | "lastSignIn" | "avatar" | "chats"> & {
  password: string
}

export default function LoginPage() {
  const router = useRouter()
  const threads = useThreads()
  const { showMessage } = useSnackbar()
  const [hasAccount, setHasAccount] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const inputRefs = useRef<Array<HTMLInputElement | null>>([])
  const [userInputData, setUserInputData] = useState<UserInputData>({
    firstName: "",
    lastName: "",
    email: "",
    password: ""
  })

  const handleClickShowPassword = () => {
    setShowPassword((show) => !show)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setUserInputData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleNextInput = (e: React.KeyboardEvent<HTMLElement>, index: number) => {
    if (e.key === "Enter") {
      e.preventDefault()
      if (inputRefs.current) {
        const nextInput = inputRefs.current[index + 1]
        if (nextInput) {
          nextInput.focus()
        }
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>, isLogin: boolean) => {
    e.preventDefault()
    setIsLoading(true)
    const formData = new FormData()
    Object.keys(userInputData).forEach(key => {
      formData.append(key, userInputData[key as keyof UserInputData])
    })
    if (isLogin) {
      // Pushes any threads/messages created while logged out into the user's DB storage
      const res = await logIn(formData, threads)
      if (res.success && res.user) {
        const name = res.user.user_metadata.first_name || ""
        showMessage("success", `Welcome back ${name}!`)

        router.push("/chat")

      } else {
        showMessage("error", res.message || "An undefined error occurred")
      }
      setIsLoading(false)

    } else {
      // Pushes any threads/messages created before signing up into the user's new DB storage
      const res = await signUp(formData, threads)
      if (res.success) {
        const name = res.user?.user_metadata.first_name || ""
        showMessage("success", `Successfully created account\nWelcome ${name}!`)
        router.push("/chat")
      } else {
        showMessage("error", res.message || "An undefined error occurred")
      }
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
      <LoadingDialog open={isLoading} message="Authenticating..." />

      <FlexBox sx={{
        flexDirection: "column",
        width: "96%", 
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
                  value={userInputData.email}
                  onChange={handleInputChange}
                  inputRef={(el) => (inputRefs.current[0] = el)}
                  onKeyDown={(e) => handleNextInput(e, 0)}
                  required 
                  slotProps={{
                    htmlInput: {
                      enterKeyHint: "next"
                    },
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
                  value={userInputData.password}
                  onChange={handleInputChange}
                  inputRef={(el) => (inputRefs.current[1] = el)}
                  required 
                  slotProps={{
                    htmlInput: {
                      enterKeyHint: "go"
                    },
                    inputLabel: {
                      shrink: true
                    },
                    input: {
                      endAdornment: 
                        <InputAdornment 
                          position="end" 
                          sx={{ cursor: "pointer" }}
                        >
                          <IconButton 
                            onClick={handleClickShowPassword}
                            aria-label={showPassword ? "Hide password" : "Show Password"}
                          >
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
                  aria-label="Submit login"
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
                    aria-label="Create an account"
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
                <Divider orientation="horizontal" sx={{ marginBottom: "1rem" }} flexItem />
                <Button 
                  variant="contained" 
                  onClick={handleOAuthLogin}
                  disabled
                  // disabled={isLoading}
                  aria-label="Sign In with Google"
                  sx={{ width: "100%", height: "2.5rem", gap: "0.25rem" }}
                >
                  <GoogleLogo size={20} weight="fill" />
                  Google   *coming soon*
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
                    value={userInputData.firstName}
                    onChange={handleInputChange}
                    inputRef={(el) => (inputRefs.current[0] = el)}
                    onKeyDown={(e) => handleNextInput(e, 0)}
                    required 
                    slotProps={{
                      htmlInput: {
                        enterKeyHint: "next"
                      },
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
                    value={userInputData.lastName}
                    onChange={handleInputChange}
                    inputRef={(el) => (inputRefs.current[1] = el)}
                    onKeyDown={(e) => handleNextInput(e, 1)}
                    slotProps={{
                      htmlInput: {
                        enterKeyHint: "next"
                      },
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
                  value={userInputData.email}
                  onChange={handleInputChange}
                  inputRef={(el) => (inputRefs.current[2] = el)}
                  onKeyDown={(e) => handleNextInput(e, 2)}
                  required 
                  slotProps={{
                    htmlInput: {
                      enterKeyHint: "next"
                    },
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
                  value={userInputData.password}
                  onChange={handleInputChange}
                  inputRef={(el) => (inputRefs.current[3] = el)}
                  required 
                  slotProps={{
                    htmlInput: {
                      enterKeyHint: "go"
                    },
                    inputLabel: {
                      shrink: true
                    },
                    input: {
                      endAdornment: 
                        <InputAdornment 
                          position="end" 
                          sx={{ cursor: "pointer" }}
                        >
                          <IconButton 
                            onClick={handleClickShowPassword}
                            aria-label={showPassword ? "Hide password" : "Show Password"}
                          >
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
                  aria-label="Submit signup"
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
                    aria-label="Go to login page"
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
                  disabled
                  // disabled={isLoading}
                  aria-label="Sign In with Google"
                  sx={{ width: "100%", height: "2.5rem", gap: "0.25rem" }}
                >
                  <GoogleLogo size={20} weight="fill" />
                  Google   *coming soon*
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
    </PageLayout>
  )
}
