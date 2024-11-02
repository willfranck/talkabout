"use client"
import { useState, useRef, useEffect } from "react"
import { useUser, useSnackbar } from "@hooks/global"
import { User } from "@types"
import { updateUser } from "@services/supabase-actions"
import { PageLayout} from "@ui/mui-layout"
import { 
  FlexBox, 
  LoadingDialog 
} from "@ui/mui-elements"
import { 
  FormControl,
  TextField,
  Button
} from "@mui/material"
import { NotePencil} from "@phosphor-icons/react/dist/ssr"

type UserInputData = Omit<User, "id" | "created" | "lastSignIn" | "avatar" | "chats">

export default function ProfilePage() {
  const { showMessage } = useSnackbar()
  const { user } = useUser()
  const [isLoading, setIsLoading] = useState(true)
  const inputRefs = useRef<Array<HTMLInputElement | null>>([])
  const [userInputData, setUserInputData] = useState<User>({
    id: "",
    email: "",
    created: "",
    lastSignIn: "",
    firstName: "",
    lastName: "",
    avatar: "",
    chats: []
  })

  useEffect(() => {
    if (!user) return
    
    if (user) {
      setUserInputData({
        ...user,
        avatar: user.avatar || ""
      })
    }
    setIsLoading(false)
  }, [user])

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    const formData = new FormData()
    Object.keys(userInputData).forEach(key => {
      formData.append(key, userInputData[key as keyof UserInputData])
    })
    const res = await updateUser(formData)
    if (res.success) {
      showMessage("success", "Updated account\n\nCheck your new email for the confirmation link to complete the update if it was changed")
    } else {
      showMessage("error", res.message || "An undefined error occurred")
    }
    setIsLoading(false)
  }

  return (
    <PageLayout>
      <LoadingDialog open={isLoading} />
      
      {!isLoading && (
        <FormControl 
          component="form" 
          onSubmit={(e) => handleSubmit(e)}
          sx={{ 
            padding: "2rem", 
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
              {/* <TextField 
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
              /> */}
              <Button 
                variant="outlined" 
                type="submit"
                disabled={isLoading}
                aria-label="Submit signup"
                sx={{ width: "100%", height: "2.5rem", gap: "0.5rem" }}
              >
                <NotePencil size={18} />
                Update
              </Button>
            </FlexBox>
          </FlexBox>
        </FormControl>
      )}
    </PageLayout>
  )
}
