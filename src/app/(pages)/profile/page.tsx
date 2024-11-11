"use client"
import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { useThreadCount, useMessages } from "@hooks/chat"
import { useUser, useSnackbar } from "@hooks/global"
import { User } from "@types"
import { updateUser } from "@services/supabase-actions"
import { useAppDispatch } from "@redux/hooks"
import { clearAll } from "@globals/functions"
import { PageLayout} from "@ui/mui-layout"
import { 
  FlexBox, 
  LoadingDialog 
} from "@ui/mui-elements"
import { 
  FormControl,
  TextField,
  Button,
  Avatar,
  Typography,
  Divider
} from "@mui/material"
import { NotePencil } from "@phosphor-icons/react/dist/ssr"


type UserInputData = Pick<User, "email" | "firstName" | "lastName">

export default function ProfilePage() {
  const dispatch = useAppDispatch()
  const { showMessage } = useSnackbar()
  const { user, refreshUser } = useUser()
  const threadCount = useThreadCount()
  const messages = useMessages()
  const [isLoading, setIsLoading] = useState(true)
  const [canEdit, setCanEdit] = useState(false)
  const inputRefs = useRef<Array<HTMLInputElement | null>>([])
  const [userInputData, setUserInputData] = useState<UserInputData>({
    email: "",
    firstName: "",
    lastName: ""
  })

  useEffect(() => {
    if (!user) return
    
    if (user) {
      setUserInputData(user)
    }
    setIsLoading(false)
  }, [user])

  const stringAvatar = (first: string, last: string | undefined) => {
    return {
      children: `${first.split(" ")[0][0]}${last?.split(" ")[0][0] || ""}`
    }
  }

  const handleEditInfo = () => {
    setCanEdit((canEdit) => !canEdit)
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setCanEdit(false)
    const formData = new FormData()
    Object.keys(userInputData).forEach(key => {
      formData.append(key, userInputData[key as keyof UserInputData])
    })
    const res = await updateUser(formData)
    if (res.success) {
      showMessage("success", "Updated account\n\nCheck your new email for the confirmation link to complete the update if it was changed", 6000)
      await refreshUser()
    } else {
      showMessage("error", res.message || "An undefined error occurred", 3000)
    }
    setIsLoading(false)
  }

  const handleDeleteUser = async () => {
    // setIsLoading(true)
    // setCanEdit(false)

    // const res = await deleteUser()
    // if (res.success) {
    //   showMessage("success", "Account deleted", 6000)
    //   await refreshUser()
    // } else {
    //   showMessage("error", res.message || "An undefined error occurred", 3000)
    // }
    // setIsLoading(false)
  }

  return (
    <PageLayout>
      <LoadingDialog open={isLoading} message="Reticulating splines..." />
      
      {user && (
        <>
          <FlexBox sx={{ 
            alignItems: "start",
            flexGrow: "1", 
            height: "100%",
            overflowY: "auto" 
          }}>
            <FlexBox sx={{ 
              flexDirection: "column",
              gap: "2rem",
              width: "100%",
              maxWidth: "30rem",
              marginY: "auto",
              padding: "1rem 0.5rem 3rem 1.5rem",
            }}>
              <FlexBox sx={{ 
                flexDirection: "column",
                alignItems: "start",
                gap: "1rem",
                width: "100%" 
              }}>
                <Typography 
                  variant="h2" 
                  fontWeight="bold" 
                  sx={{ 
                    width: "100%", 
                    textAlign: { xs: "center", sm: "start" }
                  }}
                >
                  Profile
                </Typography>
                <FlexBox sx={{ gap: "0.375rem" }}>
                  <Avatar 
                    {...stringAvatar(user!.firstName, user!.lastName)}
                    sx={{ 
                      width: "48px", 
                      height: "48px", 
                      fontSize: "1.25rem",
                      color: "secondary.contrastText", 
                      backgroundColor: "primary.dark" 
                    }}
                  ></Avatar>
                  <Typography variant="body1" fontSize="1.375rem" fontWeight="bold" sx={{ textWrap: "pretty"}}>
                    {`${user!.firstName}`}
                  </Typography>
                </FlexBox>
              </FlexBox>

              <FlexBox sx={{ 
                flexDirection: "column",
                alignItems: "start",
                gap: "1.5rem",
                width: "100%"
              }}>
                <FlexBox sx={{ 
                  flexDirection: "column",
                  alignItems: "start",
                  gap: "0.25rem" 
                }}>
                  <Typography sx={{ marginBottom: "0.25rem" }}>Stats</Typography>
                  <Typography variant="body2">
                    {`Threads: ${threadCount}    Messages: ${messages.length}`}
                  </Typography>
                  <Typography variant="body2">
                    {`Joined:  ${new Date(user!.created).toLocaleDateString()}`}
                  </Typography>
                </FlexBox>

                <FlexBox sx={{ 
                  flexDirection: "column",
                  alignItems: "start",
                  width: "100%"
                }}>
                  <FlexBox sx={{ 
                    justifyContent: "space-between",
                    width: "100%" 
                  }}>
                    <Typography>Info</Typography>
                    <Button 
                      variant="text" 
                      onClick={handleEditInfo}
                      sx={{ width: "4rem" }}
                    >
                      {!canEdit ? "Edit" : "Cancel"}
                    </Button>
                  </FlexBox>

                  <FormControl 
                    component="form" 
                    onSubmit={(e) => handleSubmit(e)}
                    sx={{ 
                      width: "100%",
                      padding: "0.5rem 0.5rem 0 0", 
                      backgroundColor: "transparent"
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
                          disabled={!canEdit}
                          required 
                          slotProps={{
                            htmlInput: { enterKeyHint: "next" },
                            inputLabel: { shrink: true }
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
                          disabled={!canEdit}
                          slotProps={{
                            htmlInput: { enterKeyHint: "next" },
                            inputLabel: { shrink: true }
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
                          disabled={!canEdit}
                          required 
                          slotProps={{
                            htmlInput: { enterKeyHint: "go" },
                            inputLabel: { shrink: true }
                          }}
                          sx={{ 
                            width: "100%", 
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
                          sx={{ 
                            visibility: (canEdit ? "visible" : "hidden"),
                            height: "2.5rem", 
                            gap: "0.5rem" }}
                        >
                          <NotePencil size={18} />
                          Update
                        </Button>
                      </FlexBox>
                    </FlexBox>
                  </FormControl>

                  <Divider sx={{ marginY: "1rem", borderColor: "primary.dark" }} flexItem />
                  
                  <FlexBox sx={{ 
                    flexDirection: "column",
                    alignItems: "start",
                    gap: "0.5rem",
                    width: "100%"
                  }}>
                    <Typography fontSize="1.375rem" fontWeight="bold" color="error.dark">Danger Zone</Typography>
                    <FlexBox sx={{ 
                      flexDirection: { xs: "column", sm: "row" },
                      gap: "0.5rem", 
                      width: "100%" 
                    }}>
                      <Button 
                        variant="outlined" 
                        color="error" 
                        onClick={() => clearAll(dispatch)}
                        aria-label="Clear all chats"
                        sx={{ width: { xs: "100%", sm:"50%" } }}
                      >
                        Clear All Chats
                      </Button>
                      <Button 
                        variant="outlined" 
                        color="error" 
                        onClick={handleDeleteUser}
                        aria-label="Delete account"
                        disabled
                        sx={{ width: { xs: "100%", sm:"50%" } }}
                      >
                        *Delete Acct Coming Soon*
                      </Button>
                    </FlexBox>
                  </FlexBox>
                </FlexBox>
              </FlexBox>
            </FlexBox>
          </FlexBox>

          <FlexBox sx={{
            flexShrink: "0",
            width: { xs: "7rem", sm: "14rem", md: "20rem", lg: "26rem" },
            height: "100%",
          }}>
            <Image 
              src={"/images/Llama_Banner.webp"}
              alt="Llama banner"
              width={256}
              height={256}
              priority
              className="w-full h-full object-cover opacity-40"
            />
          </FlexBox>
        </>
      )}
    </PageLayout>
  )
}
